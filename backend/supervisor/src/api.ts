import express from "express";
import https from "https";
import { HostLink } from "./host-link";

export class API {

    private port: number;
    private cert: any;
    private hostLink: HostLink;
    // private dba: DatabaseAdapter;

    constructor(port: number, cert: any, hostLink: HostLink) {
        	this.port = port;
            this.cert = cert;
            this.hostLink = hostLink;
            // this.dba = new DatabaseAdapter();
    }

    public init() {
        const app = express();
        app.use(express.urlencoded({ extended: true }));
        const httpsWebServer = https.createServer(this.cert, app);
        // const httpsWebServer = https.createServer(app);
    
        httpsWebServer.listen(this.port, () => {
            console.log(`Supervisor API listening to port ${this.port}`);
            this.registerRoutes(app);
        });
    }

    // TODO: get best Host
    private getHost(): string {
        return 'Alpha';
    }

    private registerRoutes(app: express.Application) {
        app.use((req, res, next) => {
            // res.header('Access-Control-Allow-Origin', 'https://mud-ga.me');
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Content-Type', 'application/json');
            next();
        });

        // platform authentication
        app.post('/auth', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined) {
                let user: string = body.user;
                if (body.password !== undefined) {
                    let password: string = body.password;
                    // TODO
                } else if (body.token !== undefined) {
                    let token: string = body.token;
                    // TODO
                }
            }
        });

        // login to dungeon
        app.post('/login', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.character !== undefined && body.dungeon !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let character: string = body.character;
                let dungeon: string = body.dungeon;
                let authToken: string = body.authtoken;
                // TODO
            }
        });
        
        // start dungeon
        app.post('/startDungeon', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.dungeon !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let dungeon: string = body.dungeon;
                let authToken: string = body.authtoken;
                // TODO
            }
        });

        // stop dungeon
        app.post('/stopDungeon', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.dungeon !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let dungeon: string = body.dungeon;
                let authToken: string = body.authtoken;
                // TODO
            }
        });

        // get dungeons
        app.get('/dungeons', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                // TODO
            }
        });

        // create dungeon
        app.post('/dungeon', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined && body.dungeonData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                let dungeonData: any = body.dungeonData;
                // TODO
            }
        });

        // get dungeon
        app.post('/dungeon/:dungeonID', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                // TODO
            }
        });

        // edit dungeon
        app.patch('/dungeon/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined && body.dungeonData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                let dungeonData: any = body.dungeonData;
                // TODO
            }
        });

        // delete dungeon
        app.delete('/dungeon/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                // TODO
            }
        });

        // get character attributes for dungeon
        app.get('/character/attributes/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                // TODO
            }
        });

        // get user-characters for dungeon
        app.get('/characters/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                // TODO
            }
        });

        // create character
        app.post('/character/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authtoken !== undefined && body.characterData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authtoken;
                let characterData: any = body.characterData;
                // TODO
            }
        });
    }

    private generateVerifyToken(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result: string = '';
        for (let i = 0; i < 32; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
