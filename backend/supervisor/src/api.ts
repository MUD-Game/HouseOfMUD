import express from 'express';
import https from 'https';
import http from 'http';
import { HostLink } from './host-link';
import { TLS } from './types/tls';
import * as comm from './types/api';
import { GetDungeonResponse } from './types/api';
import { mockauth, mockresponse } from './mock/api';
import authProvider from './services/auth-provider';
import auth from './middlewares/auth';

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
            // IMPORTANT: this is a CORS-preflight request need to change that ASAP!!!.
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.header('Content-Type', 'application/json');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Credentials', 'true');
            var cookies = req.headers.cookie;
            if (cookies) {
                req.cookies = cookies.split(";").reduce((obj: any, c) => {
                    var n = c.split("=");
                    obj[n[0].trim()] = n[1].trim();
                    return obj
                }, {})
            }
            next();
        });
        // Needed for Browser Cors stuff
        app.options('*', (req, res) => {
            res.sendStatus(200);
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

        // TODO: Create actual authentication
        // platform authentication
        app.post('/auth', auth ,  (req, res) => {
            res.json({ok:1});
        });

        // login to dungeon
        app.post('/login/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.character !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let character: string = body.character;
                let authToken: string = body.authToken;
                // TODO: Check if user has permission <-- will be solved with the auth middleware

                if (this.hostLink.dungeonExists(dungeonID)) {
                    let verifyToken: string = this.generateVerifyToken();
                    this.hostLink.setCharacterToken(dungeonID, user, character, verifyToken);
                    res.json({ ok: 1, verifyToken: verifyToken });
                } else {
                    res.json({ ok: 0, error: 'Dungeon does not exists' });
                }
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // start dungeon
        app.post('/startDungeon/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO: Check permission
                this.hostLink.startDungeon(dungeonID);
                res.json({ ok: 1 });
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // stop dungeon
        app.post('/stopDungeon/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO: Check permission
                this.hostLink.stopDungeon(dungeonID);
                res.json({ ok: 1 });
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // get dungeons
        app.get('/dungeons', auth, (req, res) => {
            res.json({ ok: 1, dungeons: mockresponse.getalldungeons });
        });

        app.get('/myDungeons', auth, (req, res) => {   
            res.json({ ok: 1, dungeons: mockresponse.getmydungeons });
        });

        // create dungeon
        app.post('/dungeon', auth,  (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.dungeonData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let dungeonData: any = body.dungeonData;
                // TODO
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // get dungeon
        app.get('/dungeon/:dungeonID', auth, (req, res) => {
            let params: any = req.query;
            if (params.user !== undefined && params.authToken !== undefined) {
                let user: string = params.user;
                let authToken: string = params.authToken;
                // TODO
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // edit dungeon
        app.patch('/dungeon/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.dungeonData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let dungeonData: any = body.dungeonData;
                // TODO
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // delete dungeon
        app.delete('/dungeon/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                // TODO
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // get character attributes for dungeon
        app.get('/character/attributes/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let params: any = req.query;
            if (params.user !== undefined && params.authToken !== undefined) {
                let user: string = params.user;
                let authToken: string = params.authToken;
                res.json({
                    ok: 1,
                    ...mockresponse.getcharacterattributes
                })
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // get user-characters for dungeon
        app.get('/characters/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let params: any = req.query;
            if (params.user !== undefined && params.authToken !== undefined) {
                let user: string = params.user;
                let authToken: string = params.authToken;
                res.json({ ok: 1, characters: mockresponse.getcharacters });
                // TODO
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // create character
        app.post('/character/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.characterData !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let characterData: any = body.characterData;
                // TODO
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });

        // delete character
        app.delete('/character/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body.user !== undefined && body.authToken !== undefined && body.character !== undefined) {
                let user: string = body.user;
                let authToken: string = body.authToken;
                let characterID: any = body.character;
                // TODO
            } else {
                res.json({ ok: 0, error: 'Invalid parameters' });
            }
        });
    }

    private generateVerifyToken(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result: string = '';
        for (let i = 0; i < 32; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    }
}
