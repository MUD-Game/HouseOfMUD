import { Cert, TLS } from "./tls"

export interface Config {
    api: {
        port: number,
    }
    hostLink: {
        hostAuthKey: string,
        port: number,
    }
    tls: TLS

    mongodb: {
        host: string,
        port: number,
        user: string,
        password: string,
    }
}