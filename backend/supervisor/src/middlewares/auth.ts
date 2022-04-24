import { NextFunction, Request, Response } from 'express';
import { mockauth } from '../mock/api';
import authProvider from '../services/auth-provider';

const auth = async (req: Request , res: Response, next: NextFunction) => {
    try {
        let body: any = req.body || {};
        let authToken = req.cookies?.authToken;
        let user = req.cookies?.user;
        let authStatus, backToken;
        if (authToken) {
            authStatus = await authProvider.validateToken(user || "", authToken);
            if( authStatus ) backToken = authToken;
        } else if (body.user && body.password) {
            user = body.user;
            let password: string = body.password;
            authStatus = await authProvider.validatePassword(user, password);
            if (authStatus) backToken = mockauth.authToken;
        }
       
            res.cookie('authToken', backToken || "", { maxAge: authStatus ? 3600 * 1000 : 0, httpOnly: true, secure: true });
            res.cookie('user', user || "", {  maxAge: authStatus ? 3600 * 1000 : 0, httpOnly: true, secure: true });
            authStatus || res.json({ ok: 0, error: 'Not Authorized' }) ;
            authStatus && next(); // Only go to the next one if the user is authenticated
    } catch (error){
        console.log(error);
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

export default auth;