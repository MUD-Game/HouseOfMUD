export interface TLS {
    use: boolean,
    cert?: {
        key: string,
        cert: string,
        ca: string
    }
}