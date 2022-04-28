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
import bodyParser from 'body-parser';
import { DatabaseAdapter } from './services/databaseadapter/databaseAdapter';
import { Dungeon } from './services/databaseadapter/datasets/dungeon';
import crypto, { Hmac } from 'crypto';
import { User } from './services/databaseadapter/datasets/user';
import nodemailer from 'nodemailer'

/**
 * client http-API
 */
export class API {

    private origin: string;

    private port: number;
    private tls: TLS;
    private hostLink: HostLink;
    private dba: DatabaseAdapter;
    private unverified_users: { [token: string]: User } = {};
    private salt: string
    private transporter: any
    private verifyLink:string
    /**
     * @param port api port 
     * @param tls TLS object
     * @param hostLink host link object
     * @param dba databaseAdapter object
     */
    constructor(origin: string, port: number, tls: TLS, hostLink: HostLink, dba: DatabaseAdapter, salt: string, verifyLink:string, transporter: any) {
        this.origin = origin;
        this.port = port;
        this.tls = tls;
        this.hostLink = hostLink;
        this.dba = dba;
        this.salt = salt;
        this.transporter = transporter
        this.verifyLink = verifyLink;

    }

    /**
     * init the api
     */
    public init() {
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
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

    /**
     * register api routes with their code
     * @param app express app
     */
    private registerRoutes(app: express.Application) {
        app.use((req, res, next) => {
            // res.header('Access-Control-Allow-Origin', 'https://mud-ga.me');
            // IMPORTANT: this is a CORS-preflight request need to change that ASAP!!!.
            res.header('Access-Control-Allow-Origin', this.origin);
            res.header('Content-Type', 'application/json');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
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
        app.post('/register', async (req, res) => {
            let body: any = req.body;
            if (body.user !== undefined && body.email !== undefined && body.password !== undefined) {
                let hasher = crypto.createHmac('sha256', this.salt);
                let user: string = body.user;
                let email: string = body.email;
                let password: string = hasher.update(body.password).digest('base64');
                if( Object.keys(this.unverified_users).some(token => this.unverified_users[token].username === user) || await this.dba.checkIfUserExists(user)){
                    res.status(409).send({
                        ok:0,
                        error: "User already exists"
                    });
                } else if (Object.keys(this.unverified_users).some(token => this.unverified_users[token].email === email) || await this.dba.checkIfEmailExists(email)) {
                    res.status(409).send({
                        ok:0,
                        error: "Email already exists"
                    });
                } else {
                    let verifyToken: string = this.generateVerifyToken();
                    this.unverified_users[verifyToken] = {
                        username: user,
                        password: password,
                        email: email
                    };
                    let options = {
                        from: 'HouseOfMUD <houseofmud2022@gmail.com>',
                        to: email,
                        subject: 'Email-Verifizierung',
                        text: `Bitte klicken Sie auf den folgenden Link um Ihre Email zu verifizieren: ${this.verifyLink}?token=${verifyToken}`
                    }
                    this.transporter.sendMail(options, (error: any, info: any) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ok:0,error:error});
                        }else{
                            res.status(200).json({ok:1});
                        }
                    });
                }

            }else{
                res.status(400).send({
                    ok:0,
                    error: "missing parameters"
                });
            }
        });

        app.post('/verify', (req,res)=>{
            let body: any = req.body;
            if(body.token !== undefined){
                if(this.unverified_users[body.token] !== undefined){
                    let user: User = this.unverified_users[body.token];
                    delete this.unverified_users[body.token];
                    this.dba.registerUser({username: user.username, password: user.password, email: user.email});
                    res.status(200).send({
                        ok:1
                    });
                }else{
                    res.status(400).send({
                        ok:0,
                        error: "invalid token"
                    });
                }
            }else{
                res.status(400).send({
                    ok:0,
                    error: "missing token"
                });
            }
        });

        // TODO: Create actual authentication
        // platform authentication
        app.post('/auth', auth ,  (req, res) => {
            res.json({ok:1});
        });

        // login to dungeon
        app.post('/login/:dungeonID', auth, (req, res) => {
            res.json({ok:1, verifyToken: this.generateVerifyToken()});
            // let dungeonID: string = req.params.dungeonID;
            // let body: any = req.body;
            // if (body.user !== undefined && body.character !== undefined && body.authToken !== undefined) {
            //     let user: string = body.user;
            //     let character: string = body.character;
            //     let authToken: string = body.authToken;
            //     // TODO: Check if user has permission <-- will be solved with the auth middleware

            //     if (this.hostLink.dungeonExists(dungeonID)) {
            //         let verifyToken: string = this.generateVerifyToken();
            //         this.hostLink.setCharacterToken(dungeonID, user, character, verifyToken);
            //         res.json({ ok: 1, verifyToken: verifyToken });
            //     } else {
            //         res.json({ ok: 0, error: 'Dungeon does not exists' });
            //     }
            // } else {
            //     res.json({ ok: 0, error: 'Invalid parameters' });
            // }
        });

        // start dungeon
        app.post('/startDungeon/:dungeonID', /*auth,*/ (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            // TODO: Check permission
            if (this.hostLink.dungeonExists(dungeonID)) {
                this.hostLink.startDungeon(dungeonID);
                res.json({ ok: 1 });
            } else {
                res.json({ ok: 0, error: 'Dungeon does not exists' });
            }
        });

        // stop dungeon
        app.post('/stopDungeon/:dungeonID', /*auth,*/ (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            // TODO: Check permission
            if (this.hostLink.dungeonExists(dungeonID)) {
                this.hostLink.stopDungeon(dungeonID);
                res.json({ ok: 1 });
            } else {
                res.json({ ok: 0, error: 'Dungeon does not exists' });
            }
        });

        // get dungeons
        app.get('/dungeons', auth, (req, res) => {
            res.json({ ok: 1, dungeons: this.hostLink.getDungeons() });
        });

        // get my dungeons
        app.get('/myDungeons', auth, (req, res) => {
            let user = req.cookies.user; // TODO: get myDungeons based on user   
            res.json({ ok: 1, dungeons: mockresponse.getmydungeons });
        });

        // create dungeon
        app.post('/dungeon', auth,  (req, res) => {
            let dungeonData: any = req.body?.dungeonData;
            let user = req.cookies.user; // TODO: get myDungeons based on user
            // let dungeonID = this.hostLink.createDungeon(dungeonData, user);
            console.log(JSON.stringify(dungeonData));
            if(dungeonData){
                this.hostLink.addDungeon(dungeonData.id, dungeonData);
                this.dba.storeDungeon(dungeonData).then(dungeonID => {
                    res.json({ ok: 1, dungeonID: dungeonID });
                }).catch(err => {
                    res.json({ ok: 0, error: err });
                });
            }else{
                res.json({ok : 0});
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
            let user = req.cookies.user!; // Cant be undefined because of auth middleware
            res.json({
                ok: 1,
                ...mockresponse.getcharacterattributes
            })
        });

        // get user-characters for dungeon
        app.get('/characters/:dungeonID', auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let user = req.cookies.user!; // Cant be undefined because of auth middleware
            //TODO: Get user-characters for dungeon
            res.json({ ok: 1, characters: mockresponse.getcharacters });
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

    /**
     * @returns random verifyToken 
     */
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
