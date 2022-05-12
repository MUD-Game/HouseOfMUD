import express from 'express';
import https from 'https';
import http from 'http';
import { HostLink } from './host-link';
import { TLS } from './types/tls';
import * as comm from './types/api';
import { GetDungeonResponse } from './types/api';
import AuthProvider from './services/AuthProvider';
import bodyParser from 'body-parser';
import { DatabaseAdapter } from './services/databaseadapter/databaseAdapter';
import crypto, { Hmac } from 'crypto';
import nodemailer from 'nodemailer'
import { CharacterDataset } from './services/databaseadapter/datasets/characterDataset';

/**
 * client http-API
 */
export class API {

    private origin: string;

    private port: number;
    private tls: TLS;
    private hostLink: HostLink;
    private dba: DatabaseAdapter;
    private authProvider:AuthProvider;
    /**
     * @param port api port 
     * @param tls TLS object
     * @param hostLink host link object
     * @param dba databaseAdapter object
     */
    constructor(origin: string, port: number, tls: TLS, hostLink: HostLink, dba: DatabaseAdapter, salt: string, transporter: any, cookiehost: string, rootpw:string) {
        this.origin = origin;
        this.port = port;
        this.tls = tls;
        this.hostLink = hostLink;
        this.dba = dba;
        this.authProvider = new AuthProvider(this.dba, salt, transporter, origin, cookiehost, rootpw);
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
        app.post('/auth/register', this.authProvider.register);

        app.post('/auth/verify', this.authProvider.verifyEmail);

        app.post('/auth/requestpassword', this.authProvider.requestPasswordReset);
        app.post('/auth/resetpassword', this.authProvider.resetPassword);

        // TODO: Create actual authentication
        // platform authentication
        app.post('/auth/login', this.authProvider.auth ,  (req, res) => {
            res.status(200).json({ok:1});
        });

        app.delete('/auth/delete', this.authProvider.auth, this.authProvider.deleteUser, (req, res) => {
            res.status(200).json({ok:1});
        });

        app.post('/auth/logout', this.authProvider.auth, this.authProvider.logout);

        app.post('/checkPassword/:dungeonID', this.authProvider.auth, async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            const { userID } = req.cookies;
            let body: any = req.body;
            let isBanned: boolean = await this.dba.isBanned(userID, dungeonID);
            if (!isBanned) {
                if (body.password !== undefined) {
                    if (this.hostLink.checkPassword(dungeonID, body.password)) {
                        res.status(200).json({ok:1});
                    } else {
                        res.status(401).json({ok: 0, error: 'dungeonunauthorized'});
                    }
                }else{
                    res.status(400).json({ ok: 0, error: 'parameters' });
                }
            } else {
                res.status(401).json({ ok: 0, error: 'banned' });
            }
        });

        // login to dungeon
        app.post('/login/:dungeonID', this.authProvider.auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let userID = req.cookies.userID;
            let body: any = req.body;
            if (body.character !== undefined && this.hostLink.dungeonExists(dungeonID)) {
                let character = body.character;
                let verifyToken: string = this.generateVerifyToken();
                this.hostLink.setCharacterToken(dungeonID, userID, character, verifyToken);
                res.status(200).json({ok:1, verifyToken: verifyToken});
            } else {
                res.status(400).json({ ok: 0, error: 'internal' });
            }
        });

        // start dungeon
        app.post('/startDungeon/:dungeonID', /*this.authProvider.auth,*/ async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            // TODO: Check permission
            if (this.hostLink.dungeonExists(dungeonID)) {
                try {
                    if (await this.hostLink.startDungeon(dungeonID)) {
                        res.status(200).json({ ok: 1 });
                    } else {
                        res.status(500).json({ ok: 0, error: 'internal' });
                    }
                } catch (err) {
                    res.status(500).json({ ok: 0, error: 'internal' });
                }
            } else {
                res.status(400).json({ ok: 0, error: 'internal' });
            }
        });

        // stop dungeon
        app.post('/stopDungeon/:dungeonID', /*this.authProvider.auth,*/ async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            // TODO: Check permission
            if (this.hostLink.dungeonExists(dungeonID)) {
                await this.hostLink.stopDungeon(dungeonID);
                res.status(200).json({ ok: 1 });
            } else {
                res.status(400).json({ ok: 0, error: 'dontexist' });
            }
        });

        // get dungeons
        app.get('/dungeons', this.authProvider.auth, (req, res) => {
            res.status(200).json({ ok: 1, dungeons: this.hostLink.getOnlineDungeons() });
        });

        // get my dungeons
        app.get('/myDungeons', this.authProvider.auth, async (req, res) => {
            let userID = req.cookies.userID; // TODO: get myDungeons based on user   
            res.status(200).json({ ok: 1, dungeons: this.hostLink.getDungeonsOfCreator(userID) });
        });

        // create dungeon
        app.post('/dungeon', this.authProvider.auth, async (req, res) => {
            let dungeonData: any = req.body?.dungeonData;
            const {userID} = req.cookies;
            if(dungeonData){
                // Check if dungeon with name already exists
                if(this.hostLink.dungeonNameExists(dungeonData.name)){
                    res.status(400).json({ ok: 0, error: 'dungeonalreadyexists' });
                    return;
                }
                dungeonData.masterId = userID;
                dungeonData.creatorId = userID;
                this.dba.storeDungeon(dungeonData).then(dungeon => {
                    this.hostLink.addDungeon(dungeon._id.toString(), dungeonData);
                    res.status(200).json({ ok: 1, dungeonID: dungeon._id.toString() });
                }).catch(err => {
                    res.status(500).json({ ok: 0, error: err.message });
                });
            }else{
                res.status(400).json({ok : 0, error: 'parameters'});
            }
        });

        // get dungeon
        app.get('/dungeon/:dungeonID', this.authProvider.auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            if(dungeonID){
                this.dba.getDungeon(dungeonID).then(dungeon => {
                    res.status(200).json({ ok: 1, dungeon: dungeon });
                }).catch(err => {
                    res.status(500).json({ ok: 0, error: err.message });
                });
            } else {
                res.status(400).json({ ok: 0, error: 'parameters' });
            }
        });

        // edit dungeon
        app.patch('/dungeon/:dungeonID', this.authProvider.auth, async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            const {user, userID} = req.cookies;
            if(userID && !this.hostLink.isDungeonCreator(dungeonID, userID)){
                res.status(401).json({ ok: 0, error: 'notcreator' });
            }else{

                if (body.dungeonData !== undefined) {
                    let dungeonData: any = body.dungeonData;
                if (this.hostLink.dungeonExists(dungeonID)) {
                    this.dba.updateDungeon(dungeonID, dungeonData).then((newDungeon) => {
                        if(newDungeon){
                            this.hostLink.deleteDungeon(dungeonID);
                            this.hostLink.addDungeon(newDungeon._id.toString(), newDungeon); // DONT YOU DARE, TOUCH THIS LINE
                            res.status(200).json({ ok: 1, dungeonID: newDungeon._id.toString() });
                        }else{
                            res.status(500).json({ ok: 0, error: 'internal' });
                        }

                    }).catch(err => {
                        res.status(500).json({ ok: 0, error: err.message });
                    });
                }
            } else {
                    res.status(200).json({ ok: 0, error: 'parameters' });
            }
        }
        });
        
        // delete dungeon
        app.delete('/dungeon/:dungeonID', this.authProvider.auth, async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            const {user, userID} = req.cookies;
            if(userID){
                if(this.hostLink.isDungeonCreator(dungeonID, userID)){
                    this.hostLink.deleteDungeon(dungeonID);
                    this.dba.deleteDungeon(dungeonID).then(() => {
                        res.status(200).json({ ok: 1 });
                    }).catch(err => {
                        res.status(500).json({ ok: 0, error: err.message });
                    });
                }else{
                    res.status(401).json({ ok: 0, error: 'notcreator' });
                }
            }else{
                res.status(400).json({ ok: 0, error: 'parameters' });
            }
        });

        // get character attributes for dungeon
        app.get('/character/attributes/:dungeonID', this.authProvider.auth, async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let user = req.cookies.user!; // Cant be undefined because of auth middleware
            this.dba.getDungeonCharacterAttributes(dungeonID).then(attributes => {
                res.status(200).json({
                    ok: 1,
                    ...attributes
                })
            }).catch(err => {
                res.status(500).json({ ok: 0, error: err.message });
            });
            
        });

        // get user-characters for dungeon
        app.get('/characters/:dungeonID', this.authProvider.auth, async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            const userID = req.cookies.userID; // Cant be undefined because of auth middleware
            //TODO: Get user-characters for dungeon
            this.dba.getAllCharactersFromUserInDungeon(userID!, dungeonID).then(characters => {
                res.status(200).json({ ok: 1, characters: characters });
            }).catch(err => {
                res.status(500).json({ ok: 0, error: err.message });
            })
        });

        // create character
        app.post('/character/:dungeonID', this.authProvider.auth, async (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            const {userID, user} = req.cookies;
            let body: any = req.body;
            if (body.characterData !== undefined) {
                let characterData: CharacterDataset = body.characterData;
                characterData.userId = userID;
                characterData.name = characterData.name;
                characterData.exploredRooms = ["0,0"];
                if(await this.dba.checkIfCharacterExists(characterData.name, dungeonID)){
                    res.status(400).json({ ok: 0, error: 'characteralreadyexists' });
                }else{
                    this.dba.storeCharacterInDungeon(characterData, dungeonID).then(character => {
                        res.status(200).json({ ok: 1, character: character });
                    }).catch(err => {
                        res.status(500).json({ ok: 0, error: err.message });
                    });
                }
            } else {
                res.status(400).json({ ok: 0, error: 'parameters' });
            }
        });

        // delete character
        app.delete('/character/:dungeonID', this.authProvider.auth, (req, res) => {
            let dungeonID: string = req.params.dungeonID;
            let body: any = req.body;
            if (body._id !== undefined) {
                let characterID: any = body._id;
                this.dba.deleteCharacter(characterID);
                res.status(200).json({ ok: 1});
            } else {
                res.status(400).json({ ok: 0, error: 'parameters' });
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
