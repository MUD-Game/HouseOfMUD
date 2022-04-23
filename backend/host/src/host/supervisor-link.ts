import { io } from 'socket.io-client';

export class SupervisorLink {

    private name: string;
    private host: string;
    private port: number;
    private tls: boolean;
    private authKey: string;

    constructor(name: string, host: string, port: number, tls: boolean, authKey: string) {
        this.name = name;
        this.host = host;
        this.port = port;
        this.tls = tls;
        this.authKey = authKey;
    }

    public connect() {
        const protocol: string = this.tls ? 'wss' : 'ws';
        const url: string = `${protocol}://${this.host}:${this.port}?name=${this.name}&key=${this.authKey}`;
        const socket = io(url);

        socket.on('error', console.log);

        socket.on('connect', () => {
            console.log(`Connected to Supervisor`);
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected from Supervisor`);
        });
    }
}
