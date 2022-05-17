import { create } from 'domain';
import { exit } from 'process';
import { io } from 'socket.io-client';
import { ForkHandler } from './fork-handler';

/**
 * responsable for handling the communication between the host and the supervisor
 */
export class SupervisorLink {

    private name: string;
    private url: string;
    private port: number;
    private tls: boolean;
    private authKey: string;
    private database: string;

    private forkHandler: ForkHandler;

    private blocked: boolean;

    /**
     * @param name the name of the host
     * @param url supervisor url
     * @param port supervisor port
     * @param tls use tls
     * @param authKey supervisor authentication
     * @param database supervisor authentication
     * @param forkHandler object that handles the forks
     */
    constructor(name: string, url: string, port: number, tls: boolean, authKey: string, database: string, forkHandler: ForkHandler) {
        this.name = name;
        this.url = url;
        this.port = port;
        this.tls = tls;
        this.authKey = authKey;
        this.database = database;

        this.forkHandler = forkHandler;

        this.blocked = false;
    }

    /**
     * connect to the supervisor and register events
     */
    public connect() {
        const protocol: string = this.tls ? 'wss' : 'ws';
        const url: string = `${protocol}://${this.url}:${this.port}?name=${this.name}&key=${this.authKey}&database=${this.database}`;
        const socket = io(url);

        socket.on('error', console.log);

        socket.on('connect', () => {
            console.log(`Connected to Supervisor`);
        });

        socket.on('init', (callback: (data: { dungeonID: string; currentPlayers: number; }[], blocked: boolean) => void) => {
            callback(this.forkHandler.getDungeons(), this.blocked);
        });

        socket.on('start', async (data: any, callback: (created: boolean) => {}) => {
            if (data.dungeonID !== undefined) {
                let created: boolean = await this.forkHandler.startDungeon(data.dungeonID);
                callback(created);
            }
        });

        this.forkHandler.dungeonStateCallback = (dungeonID: string, currentPlayers: number) => {
            socket.emit('dungeonState', { dungeonID: dungeonID, currentPlayers: currentPlayers });
        }

        socket.on('stop', (data: any) => {
            if (data.dungeonID !== undefined) {
                this.forkHandler.stopDungeon(data.dungeonID);
            }
        });

        socket.on('stopHost', (forceStop: boolean) => {
            this.blocked = true;
            if (this.forkHandler.getDungeons().length === 0) {
                socket.close();
                exit(0);
            } else if (forceStop) {
                for (let dungeon of this.forkHandler.getDungeons()) {
                    this.forkHandler.stopDungeon(dungeon.dungeonID);
                }
            }
        });

        this.forkHandler.workerExitCallback = (dungeon: string) => {
            socket.emit('exit', {
                dungeonID: dungeon
            });
            socket.emit(`exit-${dungeon}`);
            
            if (this.blocked && this.forkHandler.getDungeons().length == 0) {
                socket.close();
                exit(0);
            }
        };

        socket.on('setCharacterToken', (data: any) => {

            console.log(data);

            if (data.dungeon !== undefined && data.user !== undefined && data.character !== undefined && data.verifyToken !== undefined) {
                let dungeonID = data.dungeon;
                let userID = data.user;
                let character = data.character;
                let verifyToken = data.verifyToken;
                
                this.forkHandler.setCharacterToken(dungeonID, userID, character, verifyToken);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected from Supervisor`);
        });
    }
}
