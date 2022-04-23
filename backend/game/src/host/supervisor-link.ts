import { io } from 'socket.io-client';
import { ForkHandler } from './fork-handler';

export class SupervisorLink {

    private name: string;
    private url: string;
    private port: number;
    private tls: boolean;
    private authKey: string;

    private forkHandler: ForkHandler;

    constructor(name: string, url: string, port: number, tls: boolean, authKey: string, forkHandler: ForkHandler) {
        this.name = name;
        this.url = url;
        this.port = port;
        this.tls = tls;
        this.authKey = authKey;

        this.forkHandler = forkHandler;
    }

    public connect() {
        const protocol: string = this.tls ? 'wss' : 'ws';
        const url: string = `${protocol}://${this.url}:${this.port}?name=${this.name}&key=${this.authKey}`;
        const socket = io(url);

        socket.on('error', console.log);

        socket.on('connect', () => {
            console.log(`Connected to Supervisor`);
        });

        socket.on('init', (callback: (forkID: string) => void) => {
            
        });

        socket.on('start', (data: any) => {
            if (data.dungeonID !== undefined) {
                this.forkHandler.startDungeon(data.dungeonID);
            }
        });

        socket.on('setCharacterToken', (data: any) => {
            if (data.user !== undefined && data.dungeon !== undefined && data.character !== undefined && data.verifyToken !== undefined) {
                let userID = data.user;
                let dungeonID = data.dungeon;
                let characterID = data.character;
                let verifyToken = data.verifyToken;

                this.forkHandler.setCharacterToken(userID, dungeonID, characterID, verifyToken);
            }
        });

        socket.on('stop', () => {
            // TODO
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected from Supervisor`);
        });
    }
}
