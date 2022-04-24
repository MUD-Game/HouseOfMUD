import { HostLink } from './host-link';
import { API } from './api';
import fs from 'fs';
import { Cert, TLS } from './types/tls';
import yaml from 'js-yaml';
import { Config } from './types/config';
import { DatabaseAdapter } from './services/databaseadapter/databaseAdapter';

function main() {
    const config: Config | undefined = loadConfig();

    if (config !== undefined) {
        var cert: Cert | undefined;
        if (config.tls.use && config.tls.cert !== undefined) {
            cert = {
                key: fs.readFileSync(config.tls.cert.key).toString(),
                cert: fs.readFileSync(config.tls.cert.cert).toString(),
                ca: fs.readFileSync(config.tls.cert.ca).toString()
            }
        }
        const mongoConnString: string = `mongodb://${config.mongodb.user}:${encodeURIComponent(config.mongodb.password)}@${config.mongodb.host}:${config.mongodb.port}`;
        console.log(mongoConnString);
        const databaseAdapter = new DatabaseAdapter(mongoConnString);
        const hostLink = new HostLink(config.hostLink.port, { use: config.tls.use, cert: cert }, config.hostLink.hostAuthKey, databaseAdapter);
        const api = new API(config.api.origin, config.api.port, { use: config.tls.use, cert: cert }, hostLink, databaseAdapter);
        hostLink.init();
        api.init(); 
    }
}

function loadConfig(): Config | undefined {
    return yaml.load(fs.readFileSync('./config.yml', 'utf8')) as Config | undefined;
}

main();