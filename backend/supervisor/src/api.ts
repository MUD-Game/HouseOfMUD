import express from "express";
import https from "https";
import http from "http";
import { HostLink } from "./host-link";
import { TLS } from "./types/tls";

export class API {

    private port: number;
    private tls: TLS;
    private hostLink: HostLink;
    // private dba: DatabaseAdapter;

    constructor(port: number, tls: TLS, hostLink: HostLink) {
        	this.port = port;
            this.tls = tls;
            this.hostLink = hostLink;
            // this.dba = new DatabaseAdapter();
    }

    public init() {
        const app = express();
        app.use(express.urlencoded({ extended: true }));
        var httpWebServer;
        if (this.tls.use && this.tls.cert !== undefined) {
            httpWebServer = https.createServer(this.tls.cert, app);
        } else {
            httpWebServer = http.createServer(app);
        }
        // const httpsWebServer = https.createServer(app);
    
        httpWebServer.listen(this.port, () => {
            console.log(`Supervisor API listening to port ${this.port}`);
            this.registerRoutes(app);
        });
    }

    private registerRoutes(app: express.Application) {
        app.use((req, res, next) => {
            // res.header('Access-Control-Allow-Origin', 'https://mud-ga.me');
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Content-Type', 'application/json');
            next();
        });

        // platform registration
        app.post('/register', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.email !== undefined && body.password !== undefined) {
                let user: string = body.user;
                let email: string = body.email;
                let password: string = body.password;
                // TODO
            }
        });

        // platform authentication
        app.post('/auth', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined) {
                let user: string = body.user;
                if (body.password !== undefined) {
                    let password: string = body.password;
                    // TODO
                } else if (body.authToken !== undefined) {
                    let authToken: string = body.authToken;
                    // TODO
                }
            }
        });

        // login to dungeon
        app.post('/login/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.character !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let character: string = body.character;
                let authToken: string = body.authToken;
                // TODO
            }
        });
        
        // start dungeon
        app.post('/startDungeon/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            console.log(body);
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
                this.hostLink.startDungeon(dungeonID);
                res.json({ ok: 1 });
            } else {
                this.hostLink.startDungeon(dungeonID);
                res.json({ ok: 0 });
            }
        });

        // stop dungeon
        app.post('/stopDungeon/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
            }
        });

        // get dungeons
        app.get('/dungeons', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
            }
        });

        // create dungeon
        app.post('/dungeon', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.dungeonData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let dungeonData: any = body.dungeonData;
                // TODO
            }
        });

        // get dungeon
        app.post('/dungeon/:dungeonID', (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
            }
        });

        // edit dungeon
        app.patch('/dungeon/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.dungeonData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let dungeonData: any = body.dungeonData;
                // TODO
            }
        });

        // delete dungeon
        app.delete('/dungeon/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
            }
        });

        // get character attributes for dungeon
        app.get('/character/attributes/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
            }
        });

        // get user-characters for dungeon
        app.get('/characters/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
            }
        });

        // create character
        app.post('/character/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.characterData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let characterData: any = body.characterData;
                // TODO
            }
        });

        // delete character
        app.delete('/character/:dungeonID', (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.character !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let characterID: any = body.character;
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
