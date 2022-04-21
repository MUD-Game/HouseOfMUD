import { HostLink } from './host-link';
import { API } from './api';
import fs from 'fs';
import { TLS } from './types/tls';

const apiPort: number = 43210;
const socketPort: number = 43211;
const hostAuthKey: string = 'SuperSecretToken';

const tsl: TLS = {
    use: false,
    // cert: {
    //     key: fs.readFileSync('/etc/letsencrypt/live/privkey.pem').toString(),
    //     cert: fs.readFileSync('/etc/letsencrypt/live/fullchain.pem').toString(),
    //     ca: fs.readFileSync('/etc/letsencrypt/live/chain.pem').toString()
    // }
};

function main() {
    const hostLink = new HostLink(socketPort, tsl, hostAuthKey);
    const api = new API(apiPort, tsl, hostLink);
    hostLink.init();
    api.init();
}

main();