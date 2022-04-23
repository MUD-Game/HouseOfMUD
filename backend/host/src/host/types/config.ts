
export interface Config {
    name: string,
    supervisorLink: {
        host: string,
        port: number,
        tls: boolean,
        authKey: string
    }
}