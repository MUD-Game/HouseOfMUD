# HouseOfMUD

Software-Engineering project for the 4th semester (March-June 2022) at DHBW-Stuttgart with the goal of creating a [Multi-User-Dungeon](https://wikipedia.org/wiki/Multi_User_Dungeon) Platform.

[➤ Installation](https://github.com/MUD-Game/HouseOfMUD#user-content-installation)

## Installation

### Dependencies

* [Node.js](https://nodejs.org/en/)
* [Npm](https://www.npmjs.com/)
* [RabbitMQ](https://www.rabbitmq.com/)
* [STOMP Plugin for RabbitMQ](https://www.rabbitmq.com/stomp.html)
* [MongoDB](https://www.mongodb.com/)
* [Email Adress from a well-known service that can be used in nodemailer](https://nodemailer.com/smtp/well-known/)

### Configure Backend

Before we begin installing the project, you need to configure a few things. To get started head over to `backend/supervisor/default-config.yml` and `backend/game/default-config.yml` and copy the `default-config.yml` to create a new file `config.yml` and fill in your details:

#### supervisor/config.yml

```yml
api:
  origin: <origin for CORS where the frontend is running, e.g. http://localhost:3000> 
  port: <port for the supervisor-api>

hostLink:
  hostAuthKey: <key for other hosts to link to the supervisor>
  port: <port used to connect other hosts>

tls:
  use: <Use tls> [true|false]
  cert:
    key: <path to keyfile>
    cert: <path to certfile>
    ca: <path to chain file>

auth:
  salt: <salt-string for passwort hashign>
  emailservice: <email service to use for nodemailer e.g. gmail>
  emailadress: <email adress to use for nodemailer>
  emailsecret: <email password to use for nodemailer>
  cookiehost: <defines the host that should be set in the cookie headers e.g. localhost>

mongodb:
  host: <mongodb host>
  port: <mongodb port>
  user: <mongodb user>
  password: <mongodb password>
  database: <mongodb db-name>
```

#### game/config.yml

```yml
name: <Host-Name needs to be unique if more hosts are used>

supervisorLink:
  url: <supervisor url>
  port: <supervisor link port>
  tls: <use tls?> [true|false]
  authKey: <Same value as hostAuthKey in supervisor>

amqpAdapter:
  url: <url to reach rabbitMq/amqp>
  port: <used rabbitMq port>
  user: <rabbitmq user>
  password: <rabbitmq password>
  serverExchange: <Name to use for the server Exchange e.g. ServerExchange>
  clientExchange: <Name to use for the client Exchange e.g. ClientExchange>

mongodb:
  host: <mongodb host>
  port: <mongodb port>
  user: <mongodb user>
  password: <mongodb password>
  database: <mongodb db-name>
```

### Add a .env file to the frontend

Add a .env file into the root of `./frontend/` and fill it accordingly:

```dotenv
REACT_APP_HOM_API=<url to reach the supervisor-api e.g. http://localhost:43210>
REACT_APP_RABBITMQ=<url to reach the rabbitmq stompjs plugin e.g. wss://localhost:15673/ws>
```

### Test the configuration

Before actually deploying the project, you can run `npm start` in the root folder of the project and check if everything is working. Or you can run `npm run start<app>` (where app is one of the following: "supervisor", "host", "frontend") to start one of the components.

### Install the project

#### Install Supervisor and Frontend

Its recommended to install the Supervisor and Frontend on the same Machine, because the Frontend needs to reference the Supervisor in the build process.

##### Build and Run Frontend (`./frontend/`)

```bash
npm install
npm install serve --global
npm run build
serve -s build
```

##### Build and Run Supervisor (`./backend/supervisor/`)

```bash
npm start
```

#### Build and Run the Hosts

You can either run the hosts on the same machine as the supervisor or on a different machine. To connect multiple hosts just copy the `./backend/game/config.yml` and change the Name in the config file for every host.

##### Run a Host (`./backend/game/`)

```bash
npm start
```
