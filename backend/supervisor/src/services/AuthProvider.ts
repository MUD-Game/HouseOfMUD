import { DatabaseAdapter } from "./databaseadapter/databaseAdapter";
import { User } from "./databaseadapter/datasets/userDataset";
import crypto from 'crypto'

const COOKIE_TIME = 1000 * 60 * 60 * 24 * 30;

export default class AuthProvider {

    private dba: DatabaseAdapter;
    private transporter: any;
    private salt: string;
    private verifyLink: string;
    private passwordResetLink: string;
    private unverified_users: { [token: string]: User } = {};
    private password_reset_token: { [token: string]: string } = {};
    private sessioned_users: { [token: string] : string} = {};
    private cookiehost: string;
    

    constructor(dba: DatabaseAdapter, salt: string, transporter: any, verifyLink: string, passwordResetLink:string, cookiehost: string) {

        this.dba = dba;
        this.salt = salt;
        this.transporter = transporter;
        this.verifyLink = verifyLink;
        this.passwordResetLink = passwordResetLink;
        this.cookiehost = cookiehost;
        this.register = this.register.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.auth = this.auth.bind(this);
        this.validateToken = this.validateToken.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.logout = this.logout.bind(this);
        this.requestPasswordReset = this.requestPasswordReset.bind(this);
}

    async logout(req:any, res:any){
        if (req.cookies.authToken) {
            delete this.sessioned_users[req.cookies.authToken];
            res.cookie('authToken', "", { domain: this.cookiehost, maxAge: 0 });
            res.cookie('user', "", { domain: this.cookiehost, maxAge: 0 });
            res.cookie('userID', "", { domain: this.cookiehost, maxAge: 0 });
            res.status(200).send({
                ok: 1
            });
        }else{
            res.status(400).send({
                ok: 0,
                error: "logout"
            });
        }
    }


    async requestPasswordReset(req:any, res:any){
        let body: any = req.body;
        if (body.email !== undefined) {
            let email: string = body.email;
            if (await this.dba.checkIfEmailExists(email)) {
                let user = await this.dba.getUserByEmail(email);
                if(user){
                    let token: string = this.generateVerifyToken();
                    this.password_reset_token[token] = email;
                    let link: string = `${this.passwordResetLink}?token=${token}`;
                    let options = {
                        from: 'HouseOfMUD <houseofmud2022@gmail.com>',
                        to: email,
                        subject: 'Passwort zurücksetzen',
                        text: `Hallo ${user.username},\n\n für deinen Account wurde ein Passwort-Reset angefragt. Klicke auf den unten stehenden Link um dein Passwort neu zu setzen. \n\n${link} \n\n Falls Du diese E-Mail nicht angefordert hast, ignoriere sie bitte.`
                    }
                    this.transporter.sendMail(options, (error: any, info: any) => {error && console.error(error)});
                }
            }
        }
        res.status(200).json({ ok: 1 });
    }


    async deleteUser(req:any, res:any, next:any){
        this.dba.deleteUser(req.cookies.user).then(() => {
            if (this.sessioned_users[req.cookies.authToken]) {
                delete this.sessioned_users[req.cookies.authToken];
            }
            next();
        }).catch(() => {
            res.code(500).json({ok:0, error: "internal"});
        }
        );
    }


        async register(req:any, res:any){
        let body: any = req.body;
        if (body.user !== undefined && body.email !== undefined && body.password !== undefined) {
            let hasher = crypto.createHmac('sha256', this.salt);
            let user: string = body.user;
            let email: string = body.email;
            let password: string = hasher.update(body.password).digest('base64');
            if (Object.keys(this.unverified_users).some(token => this.unverified_users[token].username === user) || await this.dba.checkIfUserExists(user)) {
                res.status(409).send({
                    ok: 0,
                    error: "exists.user"
                });
            } else if (Object.keys(this.unverified_users).some(token => this.unverified_users[token].email === email) || await this.dba.checkIfEmailExists(email)) {
                res.status(409).send({
                    ok: 0,
                    error: "exists.email"
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
                    text: `Hallo ${user} und Willkommen! Bitte klicke auf folgenden Link um deine Email zu verifizieren: ${this.verifyLink}?token=${verifyToken}`
                }
                this.transporter.sendMail(options, (error: any, info: any) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({ ok: 0, error: error });
                    } else {
                        res.status(200).json({ ok: 1 });
                    }
                });
            }

        } else {
            res.status(400).send({
                ok: 0,
                error: "parameters"
            });
        }
    }

    async verifyEmail(req:any, res:any){
        let body: any = req.body;
        if (body.token !== undefined) {
            if (this.unverified_users[body.token] !== undefined) {
                let user: User = this.unverified_users[body.token];
                delete this.unverified_users[body.token];
                this.dba.registerUser({ username: user.username, password: user.password, email: user.email });
                res.status(200).send({
                    ok: 1
                });
            } else {
                res.status(400).send({
                    ok: 0,
                    error: "invalidtoken"
                });
            }
        } else {
            res.status(400).send({
                ok: 0,
                error: "missingtoken"
            });
        }
    }

    async auth(req: any, res: any, next: any) {
        try {
            let body: any = req.body || {};
            let authToken = req.cookies?.authToken;
            let user = req.cookies?.user;
            let userID = req.cookies?.userID;
            let authStatus, backToken;
            
            /* ----------------------------------------- */
            if (user == 'mockuser') {
                res.cookie('authToken', "", { maxAge: 0 });
                res.cookie('user',"", { maxAge : 0 });
            }
            /* ----------------------------------------- */

            if (authToken) {
                authStatus = await this.validateToken(user || "", userID || "", authToken);
                if (authStatus) backToken = authToken;
                if(userID){
                    userID = await this.dba.getUserId(user);
                }
            } else if (body.user && body.password) {
                user = body.user;
                let password: string = body.password;
                authStatus = await this.validatePassword(user, password);
                if (authStatus){
                    backToken = this.generateVerifyToken()
                    userID = await this.dba.getUserId(user);
                    this.sessioned_users[backToken] = `${user}_${userID}`;
                }
            }

            if(authStatus){
                res.cookie('authToken', backToken, { domain: this.cookiehost, maxAge: COOKIE_TIME });
                res.cookie('user', user, { domain: this.cookiehost, maxAge: COOKIE_TIME });
                res.cookie('userID', userID, { domain: this.cookiehost, maxAge:COOKIE_TIME });
                next();
            }else{
                res.cookie('authToken', "", { domain: this.cookiehost, maxAge: 0 });
                res.cookie('user',"", { domain: this.cookiehost, maxAge : 0 });
                res.cookie('userID', "", { domain: this.cookiehost, maxAge:  0 });
                res.status(401).send({
                    ok: 0,
                    error: "unauthorized"
                });
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({
                error: new Error('Invalid request!')
            });
        }
    }

    async validateToken(user: string, userID: string, token: string) {
        return (user && token && userID) && (this.sessioned_users[token] === `${user}_${userID}`);
    }
    async validatePassword(user: string, password: string) {
        // Fake wait
        const dbPw = await this.dba.getPassword(user);
        if(dbPw === undefined) return false;
        let hasher = crypto.createHmac('sha256', this.salt);
        let hashedPassword: string = hasher.update(password).digest('base64');
        return dbPw === hashedPassword;
    }

    /**
     * @returns random verifyToken 
     */
    generateVerifyToken(): string {
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
