import { Config } from './types/config';
import yaml from 'js-yaml';
import fs from 'fs';
import { SupervisorLink } from './supervisor-link';

async function main() {
    const config: Config | undefined = loadConfig();

    if (config !== undefined) {
        const supervisorLink = new SupervisorLink(config.name, config.supervisorLink.host, config.supervisorLink.port, config.supervisorLink.tls, config.supervisorLink.authKey);
        supervisorLink.connect();
    }
}

function loadConfig(): Config | undefined {
    return yaml.load(fs.readFileSync('./config.yml', 'utf8')) as Config | undefined;
}

main();