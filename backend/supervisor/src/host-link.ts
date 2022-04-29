import { Server, Socket } from 'socket.io';
import https from 'https';
import http from 'http';
import { TLS } from './types/tls';
import { DatabaseAdapter } from './services/databaseadapter/databaseAdapter';

interface Host {
    socket: Socket;
    dungeons: string[];
}

interface Hosts {
    [name: string]: Host;
}

type Status = 'offline' | 'online';

interface Dungeon {
    host?: string;
    name: string;
    description: string;
    maxPlayers: number; 
    masterId: string;
    creatorId: string;
    currentPlayers: number;
    status: Status;
}

interface Dungeons {
    [dungeon: string]: Dungeon;
}

/**
 * responsable for handling the communication between the supervisor and the host
 */
export class HostLink {
    private port: number;
    private tls: TLS;
    private authKey: string;

    public hosts: Hosts = {};
    public dungeons: Dungeons = {};
    
    databaseAdapter: DatabaseAdapter;

    constructor(port: number, tls: TLS, authKey: string, databaseAdapter: DatabaseAdapter) {
        this.port = port;
        this.tls = tls;
        this.authKey = authKey;

        this.databaseAdapter = databaseAdapter;
    }

    public async init() {
        await this.loadAvailableDungeons();

        var httpWebServer;
        if (this.tls.use && this.tls.cert !== undefined) {
            httpWebServer = https.createServer(this.tls.cert);
        } else {
            httpWebServer = http.createServer();
        }

        const serverSocket = new Server(httpWebServer);

        httpWebServer.listen(this.port, () => {
            console.log(`Socket listening on port ${this.port}`);
            this.registerEvents(serverSocket);
        });
    }

    /**
     * register events from host
     * @param serverSocket host socket
     */
    private registerEvents(serverSocket: Server) {
        serverSocket.on('error', console.error);

        serverSocket.on('connection', socket => {
            const key: string | undefined = socket.handshake.query.key as | string | undefined;
            const name: string | undefined = socket.handshake.query.name as | string | undefined;

            if (key !== undefined && name !== undefined) {
                if (key === this.authKey && !(name in this.hosts)) {
                    this.hosts[name] = {
                        socket: socket,
                        dungeons: [],
                    };

                    console.log(`Host '${name}' connected`);

                    socket.emit('init', (data: { dungeonID: string; currentPlayers: number; }[]): void => {
                        for (let dungeonStats of data) {
                            if (dungeonStats.dungeonID in this.dungeons) {
                                console.log(`init ${dungeonStats.dungeonID}`);
                                this.hosts[name].dungeons.push(dungeonStats.dungeonID);
                                this.dungeons[dungeonStats.dungeonID].status = 'online';
                                this.dungeons[dungeonStats.dungeonID].currentPlayers = dungeonStats.currentPlayers;
                                this.dungeons[dungeonStats.dungeonID].host = name;
                            }
                        }
                    });

                    socket.on('dungeonState', (data: any): void => {
                        for (let dungeonStats of data) {
                            if (dungeonStats.dungeonID in this.dungeons) {
                                this.dungeons[dungeonStats.dungeonID].status = 'online';
                                this.dungeons[dungeonStats.dungeonID].currentPlayers = data.currentPlayers;
                            }
                        }
                    });

                    socket.on('exit', (data: any): void => {
                        if (data.dungeonID !== undefined) {
                            const dungeonID: string = data.dungeonID;
                            if (this.dungeons[dungeonID] !== undefined) {
                                this.dungeons[dungeonID].currentPlayers = 0;
                                this.dungeons[dungeonID].status = 'offline';

                                const host: Host | undefined = this.getHostFromDungeon(dungeonID);
                                if (host !== undefined) {
                                    const index = host.dungeons.indexOf(dungeonID);
                                    if (index > -1) {
                                        host.dungeons.splice(index, 1); // remove dungeon from host
                                    }
                                }
                                delete this.dungeons[dungeonID].host;
                            }
                        }
                    });

                    socket.on('disconnect', () => {
                        for (let dungeon of this.hosts[name].dungeons) {
                            delete this.dungeons[dungeon].host;
                            this.dungeons[dungeon].currentPlayers = 0;
                            this.dungeons[dungeon].status = 'offline';
                        }
                        delete this.hosts[name];
                        console.log(`Host '${name}' disconnected`);
                    });
                } else {
                    socket.disconnect(true);
                }
            } else {
                socket.disconnect(true);
            }
        });
    }

    /**
     * @returns best available host
     */
    private getBestHost(): string {
        return Object.keys(this.hosts)[0];
    }

    /**
     * loads all available dungeons from database
     */
    private async loadAvailableDungeons(): Promise<void> {

        let dungeons = await this.databaseAdapter.getAllDungeonInfos();

        for (let dungeon of dungeons) {
            this.dungeons[dungeon.id] = {
                name: dungeon.name,
                description: dungeon.description,
                maxPlayers: dungeon.maxPlayers,
                masterId: dungeon.masterId,
                creatorId: dungeon.creatorId,
                currentPlayers: 0,
                status: 'offline',
            };
        }
    }


    /**
     * adds a new dungeon to the list
     * @param id dungeon id
     * @param dungeonData dungeon data from client
     */
    public addDungeon(id: string, dungeonData: any) {
        this.dungeons[id] = {
            name: dungeonData.name,
            description: dungeonData.description,
            maxPlayers: dungeonData.maxPlayers,
            masterId: dungeonData.masterId,
            creatorId: dungeonData.creatorId,
            currentPlayers: 0,
            status: 'offline'
        };
    }

    public editDungeon(id:string, dungeonData: any){
        this.dungeons[id].name = dungeonData.name;
        this.dungeons[id].description = dungeonData.description;
        this.dungeons[id].maxPlayers = dungeonData.maxPlayers;
        this.dungeons[id].masterId = dungeonData.masterId;
        this.dungeons[id].creatorId = dungeonData.creatorId;
    }

    /**
     * @returns dungeon informations for dashboard
     */
    public getDungeons(creatorId?: string): any[] {
        const dungeons: any[] = [];
        for (let dungeonID in this.dungeons) {
            if (!creatorId) {
                dungeons.push(this.dungeons[dungeonID]);
            } else if (this.dungeons[dungeonID].creatorId === creatorId){
                dungeons.push({
                    id: dungeonID,
                    ...this.dungeons[dungeonID]
                });
            }
        }
        return dungeons;
    }

    public deleteDungeon(id: string) {
        delete this.dungeons[id];
    }

    public isDungeonMaster(dungeonID: string, masterId: string): boolean {
        return this.dungeons[dungeonID].masterId === masterId;
    }

    /**
     * sends the verify token to specific host
     * @param dungeonID dungeon id
     * @param user user id
     * @param character character id
     * @param verifyToken verify token
     */
    public setCharacterToken(dungeonID: string, user: string, character: string, verifyToken: string): void {
        const host: Host | undefined = this.getHostFromDungeon(dungeonID);
        if (host !== undefined) {
            host.socket.emit('setCharacterToken', {
                user: user,
                dungeon: dungeonID,
                character: character,
                verifyToken: verifyToken,
            });
        }
    }

    /**
     * send a dungeon start event to a host
     * @param dungeonID dungeon id
     */
    public async startDungeon(dungeonID: string): Promise<boolean> {
        if (this.dungeonExists(dungeonID)) {
            const host: string = this.getBestHost();
            if (this.hosts[host] !== undefined) {
                return new Promise<boolean>((resolve, reject) => {
                    this.hosts[host].socket.emit('start', { dungeonID: dungeonID }, (created: boolean) => {
                        if (created) {
                            this.hosts[host].dungeons.push(dungeonID);
                            this.dungeons[dungeonID].host = host;
                            this.dungeons[dungeonID].status = 'online';
                            this.dungeons[dungeonID].currentPlayers = 0;
                            return resolve(true);
                        }
                        return resolve(false);
                    });
                });
            }
        }
        return false;
    }

    /**
     * sends a dungeon stop event to a host
     * @param dungeonID dungeon id
     */
    public stopDungeon(dungeonID: string): void {
        const host: Host | undefined = this.getHostFromDungeon(dungeonID);
        if (host !== undefined) {
            host.socket.emit('stop', { dungeonID: dungeonID });
        }
    }

    /**
     * @param dungeon dungeon id
     * @returns if dungeon exitsts
     */
    public dungeonExists(dungeon: string): boolean {
        return dungeon in this.dungeons;
    }

    /**
     * @param dungeon dungeon id
     * @returns the Host object of the dungeon
     */
    private getHostFromDungeon(dungeon: string): Host | undefined {
        if (this.dungeonExists(dungeon)) {
            if (this.dungeons[dungeon].host !== undefined) {
                if (this.hosts[this.dungeons[dungeon].host!] !== undefined) {
                    return this.hosts[this.dungeons[dungeon].host!];
                }
            }
        }
        return undefined;
    }
}
