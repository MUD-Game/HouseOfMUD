export interface TLS {
    use: boolean,
    cert?: Cert
}

export interface Cert {
    key: string,
    cert: string,
    ca: string
}