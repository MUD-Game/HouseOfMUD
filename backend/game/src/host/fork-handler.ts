import { ChildProcess, fork, ForkOptions } from 'child_process';
import path from 'path';

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
    async createDungeon(dungeon: string): Promise<void> {
        if (!(dungeon in this.dungeonWorker)) {
            let dungeonFork: ChildProcess = fork(filePath('../worker/worker-process.js'), [dungeon], forkOptions);
            dungeonFork.on('message', (data: any): void => this.workerMessageHandler(dungeon, data));
            dungeonFork.on('exit', (code: number): void => this.workerExitHandler(dungeon, code));
            this.dungeonWorker[dungeon] = {
                fork: dungeonFork,
                currentPlayers: 0
            };
        }
        // else Dungeon already exists
    }

    /**
     * Sends message received from amqp handler to worker. ANPASSEN
     * @param dungeon Dungeon that belongs to the fork.
     * @param user Message sender.
     * @param action Action that shall be performed by worker.
     * @param data Message data.
     */
    async sendToWorker(dungeon: string, action: DungeonAction, data: any): Promise<void> {
        if (dungeon in this.dungeonWorker) {
            this.dungeonWorker[dungeon].fork.send({
                action: action,
                data: data
            });
        }
    }
}
