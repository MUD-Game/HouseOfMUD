import { ChildProcess, fork, ForkOptions } from 'child_process';
import path from 'path';
import { AmqpAdapterConfig, MongodbConfig } from './types/config';

const filePath: (file: string) => string = (file: string) => path.resolve(__dirname, file);

/**
 * Options for creating new child processes.
 */
const forkOptions: ForkOptions = {
    // inherit to pass through stdin/stdout/stderr
    // ipc for inter process communication
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
};

/**
 * Actions that get performed inside of a dungeon.
 */
type DungeonAction = 'setCharacterToken' | 'stop';

/**
 * A class that contains the logic to handle the Forks (Worker).
 */
export class ForkHandler {

    public workerExitCallback: ((dungeon: string) => void) | undefined;
    
    private amqpConfig: AmqpAdapterConfig;
    private mongodbConfig: MongodbConfig;

    constructor (amqpConfig: AmqpAdapterConfig, mongodbConfig: MongodbConfig) {
        this.amqpConfig = amqpConfig;
        this.mongodbConfig = mongodbConfig;
    }

    /**
     * Dungeon worker process that processes incoming messages and sends messages.
     */
    private dungeonWorker: { [dungeon: string]: {
        fork: ChildProcess,
        currentPlayers: number,
        killTimeout?: NodeJS.Timeout
    }} = {};

    /**
     * @returns List of running dungeons.
     */
    public getDungeons(): { dungeonID: string; currentPlayers: number; }[] {
        return Object.keys(this.dungeonWorker).map((dungeon: string) => { return { dungeonID: dungeon, currentPlayers: this.dungeonWorker[dungeon].currentPlayers }});
    }

    public setCharacterToken(dungeon: string, userID: string, character: string, verifyToken: string): void {
        this.sendToWorker(dungeon, 'setCharacterToken', {
            user: userID,
            character: character,
            verifyToken: verifyToken
        });
    }

    /**
     * Handles sent messages by the dungeon worker and tells AMQP what to do. ANPASSEN
     * @param dungeon Dungeon that belongs to the fork.
     * @param message Message from dungeon worker.
     */
    private workerMessageHandler(dungeon: string, message: any): void {
        // TODO: currentPlayers update
    }

    /**
     * notify the supervisor that the worker has exited
     * @param dungeon Dungeon that belongs to the fork.
     * @param code exit code
     */
    private workerExitHandler(dungeon: string, code: number | null): void {
        if (dungeon in this.dungeonWorker) {
            let killTimeout = this.dungeonWorker[dungeon].killTimeout!;
            if (killTimeout !== undefined) {
                console.log('clear timeout');
                clearTimeout(killTimeout);
            }
            delete this.dungeonWorker[dungeon];
        }
        if (this.workerExitCallback !== undefined) {
            this.workerExitCallback(dungeon);
        }
        console.error(`Dungeon ${dungeon} exited with code ${code}`);
    }


    /**
     * Creates a new child process, initializes connections to exchanges and binds message handler to process
     * @param dungeon Name of the dungeon that shall be created.
     */
    startDungeon(dungeon: string): boolean {
        if (!(dungeon in this.dungeonWorker)) {
            const mongoConnString: string = `mongodb://${this.mongodbConfig.user}:${encodeURIComponent(this.mongodbConfig.password)}@${this.mongodbConfig.host}:${this.mongodbConfig.port}`;
            let args: string[] = [dungeon, this.amqpConfig.url, this.amqpConfig.port.toString(), this.amqpConfig.user, this.amqpConfig.password, this.amqpConfig.serverExchange, this.amqpConfig.clientExchange, mongoConnString, this.mongodbConfig.database];
            let dungeonFork: ChildProcess = fork(filePath('../worker/worker.js'), args, forkOptions);
            dungeonFork.on('message', (data: any): void => this.workerMessageHandler(dungeon, data));
            dungeonFork.on('exit', (code: number | null): void => this.workerExitHandler(dungeon, code));
            this.dungeonWorker[dungeon] = {
                fork: dungeonFork,
                currentPlayers: 0
            };
            return true;
        }
        return false;
        // else Dungeon already exists
    }

    /**
     * sends a stop signal to dungeon.
     * after a timeout the process is killed if it's still running.
     * @param dungeon Dungeon that belongs to the fork.
     */
    stopDungeon(dungeon: string) {
        if (dungeon in this.dungeonWorker) {
            this.sendToWorker(dungeon, 'stop', {});
            this.dungeonWorker[dungeon].killTimeout = setTimeout(() => {
                if (dungeon in this.dungeonWorker) {
                    console.log('kill');
                    this.dungeonWorker[dungeon].fork.kill();
                }
            }, 1000 * 5);
        }
    }

    /**
     * Sends message received from amqp handler to worker. ANPASSEN
     * @param dungeon Dungeon that belongs to the fork.
     * @param action Action that shall be performed by worker.
     * @param data Message data.
     */
    sendToWorker(dungeon: string, action: DungeonAction, data: any): void {
        if (dungeon in this.dungeonWorker) {
            this.dungeonWorker[dungeon].fork.send({
                action: action,
                data: data
            });
        }
    }
}
