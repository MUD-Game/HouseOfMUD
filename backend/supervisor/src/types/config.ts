import { Cert, TLS } from "./tls"

export interface Config {
    api: {
        origin: string;
        port: number;
    }
    hostLink: {
        hostAuthKey: string;
        port: number;
    }
    tls: TLS;
    auth: {
        salt: string;
        verifyLink: string;
        emailservice: string;
        emailadress: string;
        emailsecret: string;
        cookie_host: string;
    }
    mongodb: {
        host: string;
        port: number;
        user: string;
        password: string;
    }
}