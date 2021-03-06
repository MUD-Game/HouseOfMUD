

export interface SupervisorLinkConfig {
    url: string;
    port: number;
    tls: boolean;
    authKey: string;
}

export interface AmqpAdapterConfig {
    url: string;
    port: number;
    user: string;
    password: string;
    serverExchange: string;
    clientExchange: string;
}

export interface MongodbConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface Config {
    name: string;
    supervisorLink: SupervisorLinkConfig;
    amqpAdapter: AmqpAdapterConfig;
    mongodb: MongodbConfig;
}