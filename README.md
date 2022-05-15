# HouseOfMUD

Software-Engineering project for the 4th semester (March-June 2022) at DHBW-Stuttgart with the goal of creating a [Multi-User-Dungeon](https://wikipedia.org/wiki/Multi_User_Dungeon) Platform.

[➤ Installation](https://github.com/MUD-Game/HouseOfMUD/wiki/Installation-Guide)

### Dependencies

* [Node.js](https://nodejs.org/en/)
* [Npm](https://www.npmjs.com/)
* [RabbitMQ](https://www.rabbitmq.com/)
* [STOMP Plugin for RabbitMQ](https://www.rabbitmq.com/stomp.html)
* [MongoDB](https://www.mongodb.com/)
* [Email Adress from a well-known service that can be used in nodemailer](https://nodemailer.com/smtp/well-known/)

### Folder-Structure

```
├── backend
│   ├── game
│   │   ├── src
│   │   │   ├── host
│   │   │   └── worker
│   │   │       ├── action
│   │   │       │   ├── action-handler.ts <-- Action-Handler für die Nachrichten die aus RabbitMQ kommen
│   │   │       │   ├── actions
│   │   │       │   └── dmactions
│   │   │       ├── amqp
│   │   │       │   └── amqp-adapter.ts <-- AMQP-Adapter um mit RabbitMQ zu kommunizieren
│   │   │       ├── controller
│   │   │       │   └── dungeon-controller.ts <-- BusinessLogic auf dem Dungeon-Object
│   │   │       └── worker.ts
│   │   ├── test
│   └── supervisor <-- Hier liegt all der Code für die Supervisor-API
│       ├── src
│       │   ├── api.ts <-- all Express interfaces
│       │   ├── host-link.ts <-- Linker between Supervisor and Hosts
│       │   ├── services
│       │   │   ├── AuthProvider.ts <-- Authenticate Middleware for the API
│       │   ├── supervisor.ts
├── frontend
│   ├── src
│   │   ├── assets <-- Bilder, Videos etc.
│   │   ├── components <-- React-Components
│   │   ├── contexts <-- React-Contexts
│   │   ├── hooks <-- Custom-Hooks
│   │   ├── i18n <-- i18n handler
│   │   ├── routes <-- React-Router routes of the Web Application
│   │   ├── services <-- Supervisor service interface
│   │   ├── types <-- Typescript types
│   │   └── utils <-- validator
├── test
│   └── testdaten
```
