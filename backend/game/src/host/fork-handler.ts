import { ChildProcess, fork, ForkOptions } from 'child_process';
import path from 'path';
import { AmqpAdapterConfig } from './types/config';

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

    amqpConfig: AmqpAdapterConfig;

    constructor (amqpConfig: AmqpAdapterConfig) {
        this.amqpConfig = amqpConfig;
    }

    /**
     * Dungeon worker process that processes incoming messages and sends messages.
     */
    private dungeonWorker: { [dungeon: string]: {
        fork: ChildProcess,
        currentPlayers: number 
    }} = {};

    /**
     * @returns List of running dungeons.
     */
    public getDungeons(): string[] {
        return Object.keys(this.dungeonWorker);
    }

    public setCharacterToken(dungeon: string, userID: string, characterID: string, verifyToken: string): void {
        this.sendToWorker(dungeon, 'setCharacterToken', {
            user: userID,
            character: characterID,
            verifyToken: verifyToken
        });
    }

    /**
     * Handles sent messages by the dungeon worker and tells AMQP what to do. ANPASSEN
     * @param dungeon Dungeon that belongs to the fork.
     * @param message Message from dungeon worker.
     */
    private workerMessageHandler(dungeon: string, message: any): void {

    }

    private workerExitHandler(dungeon: string, code: number): void {
        delete this.dungeonWorker[dungeon];
        console.error(`Dungeon ${dungeon} exited with code ${code}`);
    }


    /**
     * Creates a new child process, initializes connections to exchanges and binds message handler to process
     * @param dungeon Name of the dungeon that shall be created.
     */
    startDungeon(dungeon: string): boolean {
        if (!(dungeon in this.dungeonWorker)) {
            let args: string[] = [dungeon, this.amqpConfig.url, this.amqpConfig.port.toString(), this.amqpConfig.user, this.amqpConfig.password, this.amqpConfig.serverExchange, this.amqpConfig.clientExchange];
            let dungeonFork: ChildProcess = fork(filePath('../worker/worker.js'), args, forkOptions);
            dungeonFork.on('message', (data: any): void => this.workerMessageHandler(dungeon, data));
            dungeonFork.on('exit', (code: number): void => this.workerExitHandler(dungeon, code));
            this.dungeonWorker[dungeon] = {
                fork: dungeonFork,
                currentPlayers: 0
            };
            return true;
        }
        return false;
        // else Dungeon already exists
    }

    stopDungeon(dungeon: string) {
        if (dungeon in this.dungeonWorker) {
            this.sendToWorker(dungeon, 'stop', {});
            setTimeout(() => {
                this.dungeonWorker[dungeon].fork.kill();
                delete this.dungeonWorker[dungeon];
            }, 1000 * 5);
        }
    }

    /**
     * Sends message received from amqp handler to worker. ANPASSEN
     * @param dungeon Dungeon that belongs to the fork.
     * @param user Message sender.
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
