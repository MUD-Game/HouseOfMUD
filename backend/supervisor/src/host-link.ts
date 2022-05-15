import { Server, Socket } from 'socket.io';
import https from 'https';
import http from 'http';
import { TLS } from './types/tls';
import { DatabaseAdapter } from './services/databaseadapter/databaseAdapter';

const DUNGEON_EXIT_TIMEOUT = 5000;

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
    password: string;
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
            const name: string | undefined = socket.handshake.query.name as | string | undefined;
            const key: string | undefined = socket.handshake.query.key as | string | undefined;
            const database: string | undefined = socket.handshake.query.database as | string | undefined;

            if (key !== undefined && name !== undefined && database !== undefined) {
                if (key === this.authKey && database === this.databaseAdapter.database && !(name in this.hosts)) {
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
                        if (data.dungeonID in this.dungeons) {
                            // this.dungeons[data.dungeonID].status = 'online';
                            this.dungeons[data.dungeonID].currentPlayers = data.currentPlayers;
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

    public dungeonNameExists(name: string) {
        return Object.keys(this.dungeons).some(dungeon => this.dungeons[dungeon].name === name);
    }

    /**
     * @returns best available host
     */
    private getBestHost(): string {
        // return Object.keys(this.hosts)[Math.floor(Math.random()*Object.keys(this.hosts).length)];

        const hostPlayers: {[host: string]: number} = {}
        
        for (let hostName in this.hosts) {
            let host = this.hosts[hostName];
            let players: number = 0;
            for (let dungeon of host.dungeons) {
                players += this.dungeons[dungeon].currentPlayers;
            }
            hostPlayers[hostName] = players;
        }

        let bestHost: string = '';
        let minPlayers: number = Number.MAX_SAFE_INTEGER;

        for (let host in hostPlayers) {
            if (hostPlayers[host] < minPlayers) {
                bestHost = host;
                minPlayers = hostPlayers[host];
            }
        }

        return bestHost;
    }

    /**
     * loads all available dungeons from database
     */
    private async loadAvailableDungeons(): Promise<void> {

        let dungeons = await this.databaseAdapter.getAllDungeonInfos();
        
        for (let dungeon of dungeons) {
            let dungeonID = dungeon._id.toString();
            this.dungeons[dungeonID] = {
                name: dungeon.name,
                description: dungeon.description,
                password: dungeon.password,
                maxPlayers: dungeon.maxPlayers,
                masterId: dungeon.masterId,
                creatorId: dungeon.creatorId,
                currentPlayers: 0,
                status: 'offline',
            };
        }
    }

    public isDungeonCreator(dungeonID: string, userID: string) {
        return this.dungeons[dungeonID].creatorId === userID;
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
            password: dungeonData.password,
            maxPlayers: dungeonData.maxPlayers,
            masterId: dungeonData.masterId,
            creatorId: dungeonData.creatorId,
            currentPlayers: 0,
            status: 'offline'
        };
    }

    /**
     * @returns all online dungeons
     */
    public async getOnlineDungeons(userID: string){
        const dungeons: any[] = [];
        for (let dungeonID in this.dungeons) {
            if (this.dungeons[dungeonID].status === 'online') {
                let dungeon = this.dungeons[dungeonID];
                dungeons.push({
                    id: dungeonID,
                    name: dungeon.name,
                    description: dungeon.description,
                    isPrivate: (dungeon.password && dungeon.password !== '') ? true : false,
                    maxPlayers: dungeon.maxPlayers,
                    currentPlayers: dungeon.currentPlayers,
                    status: dungeon.status
                });
            }
        }
        return dungeons;
    }


    /**
     * @returns dungeon informations for dashboard
     */
    public getDungeonsOfCreator(creatorId: string): any[] {
        const dungeons: any[] = [];
        for (let dungeonID in this.dungeons) {
            if (this.dungeons[dungeonID].creatorId === creatorId){
                let dungeon = this.dungeons[dungeonID];
                dungeons.push({
                    id: dungeonID,
                    name: dungeon.name,
                    description: dungeon.description,
                    isPrivate: (dungeon.password && dungeon.password !== '') ? true : false,
                    maxPlayers: dungeon.maxPlayers,
                    currentPlayers: dungeon.currentPlayers,
                    status: dungeon.status
                });
            }
        }
        return dungeons;
    }

    public deleteDungeon(dungeon: string) {
        delete this.dungeons[dungeon];
    }

    public isDungeonMaster(dungeonID: string, masterId: string): boolean {
        return this.dungeons[dungeonID].masterId === masterId;
    }

    public checkPassword(dungeonID: string, password: string): boolean {
        let dungeon = this.dungeons[dungeonID];
        if (dungeon !== undefined) {
            if (dungeon.password !== undefined && dungeon.password !== '') {
                return dungeon.password === password;
            } else {
                return true;
            }
        }
        return false;
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
    public async stopDungeon(dungeonID: string): Promise<void> {
        const host: Host | undefined = this.getHostFromDungeon(dungeonID);
        if (host !== undefined) {
            host.socket.emit('stop', { dungeonID: dungeonID });
            return new Promise((resolve, reject) => {
                host.socket.once(`exit-${dungeonID}`, () => {
                    resolve();
                });
                setTimeout(resolve, DUNGEON_EXIT_TIMEOUT);
            });
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

    public isFull(dungeonID: string) {
        return this.dungeons[dungeonID].currentPlayers >= this.dungeons[dungeonID].maxPlayers;
    }

    isRunning(dungeonID: string) {
        return this.dungeons[dungeonID].status === 'online';
    }

}
