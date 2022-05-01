import { Config } from './types/config';
import yaml from 'js-yaml';
import fs from 'fs';
import { SupervisorLink } from './supervisor-link';
import { ForkHandler } from './fork-handler';

async function main() {
    const config: Config | undefined = loadConfig();

    if (config !== undefined) {
        const forkHandler = new ForkHandler(config.amqpAdapter, config.mongodb);
        const supervisorLink = new SupervisorLink(config.name, config.supervisorLink.url, config.supervisorLink.port, config.supervisorLink.tls, config.supervisorLink.authKey, forkHandler);
        supervisorLink.connect();
    } else {
        console.log("Cannot find Config");
    }
}

function loadConfig(): Config | undefined {
    return yaml.load(fs.readFileSync('./config.yml', 'utf8')) as Config | undefined;
}

main();