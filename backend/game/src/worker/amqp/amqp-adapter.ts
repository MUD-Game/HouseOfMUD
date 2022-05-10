import amqplib from 'amqplib';

/**
 * AMQP class that holds all the information regarding routing and exchanges.
 */
export class AmqpAdapter {
    private dungeonID: string;

    private url: string;
    private port: string;
    private user: string;
    private password: string;

    private connection: amqplib.Connection | undefined;
    private channel: amqplib.Channel | undefined;
    
    // Connection Client -> Server
    private serverExchange: string;

    // Connection Server -> Client
    private clientExchange: string;

    private characterTokenTranslation: (character: string) => string | undefined;
    
    constructor(dungeonID: string, url: string, port: string, user: string, password: string, serverExchange: string, clientExchange: string) {
        this.dungeonID = dungeonID;
        this.url = url;
        this.port = port;
        this.user = user;
        this.password = password;
        this.serverExchange = serverExchange;
        this.clientExchange = clientExchange;
        
        this.characterTokenTranslation = a => a;
    }

    setCharacterTokenTranslation(ctt: (character: string) => string | undefined) {
        this.characterTokenTranslation = ctt;
    }

    isConnected(): boolean {
        return this.connection !== undefined && this.channel !== undefined;
    }

    setDisconnected(): void {
        this.channel = undefined;
        this.connection = undefined;
    }

    /**
     * Creates new exchanges.
     */
    async connect(): Promise<void> {
        try {
            // Create Connection
            this.connection = await amqplib.connect(`amqp://${this.user}:${this.password}@${this.url}:${this.port}`); 
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.serverExchange, 'direct', { autoDelete: false });
            await this.channel.assertExchange(this.clientExchange, 'topic', { autoDelete: false });

            // Assert Dungeon Queue
            await this.channel.assertQueue(this.dungeonID, { autoDelete: true });
            await this.channel.bindQueue(this.dungeonID, this.serverExchange, this.dungeonID);

            // Assert Client Exchange
            await this.channel.assertExchange(`${this.clientExchange}-${this.dungeonID}`, 'topic', { autoDelete: false, internal: true });
            await this.channel.bindExchange(`${this.clientExchange}-${this.dungeonID}`, this.clientExchange, `${this.dungeonID}.#`);
        } catch (err) {
            await this.channel?.close();
            await this.connection?.close();
            
            this.setDisconnected();

            console.error(err);
        }
    }

    async close(): Promise<void> {
        if (this.isConnected()) {
            try {
                await this.channel?.deleteQueue(this.dungeonID);

                await this.channel?.deleteExchange(`${this.clientExchange}-${this.dungeonID}`);

                await this.channel?.close();
                await this.connection?.close();
                
                this.setDisconnected();
            } catch (err) {
                throw err;
            }
        }   
    }

    /**
     * Binds new queue with dungeon specific client exchange. Client subscribes to that queue to receive messages.
     * @param character User to connect.
     */
    async initClient(character: string): Promise<void> {
        if (this.isConnected()) {
            try {
                const token = this.characterTokenTranslation(character);
                if (token) {
                    await this.channel!.assertQueue(`${this.dungeonID}-${token}`, { autoDelete: true });
                    await this.channel!.bindQueue(`${this.dungeonID}-${token}`, `${this.clientExchange}-${this.dungeonID}`, `*.user.${character}`);
                    await this.channel!.bindQueue(`${this.dungeonID}-${token}`, `${this.clientExchange}-${this.dungeonID}`, `*.broadcast`);
                }
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Binds the queue of a client to the ClientExchange with a pattern.
     * The pattern is used to filter the messages with a routingKey. 
     * @param character Client that needs to be binded.
     * @param pattern Key pattern.
     */
    async bindClientQueue(character: string, pattern: string): Promise<void> {
        if (this.isConnected()) {
            try {
                const token = this.characterTokenTranslation(character);
                if (token) {
                    await this.channel!.bindQueue(`${this.dungeonID}-${token}`, `${this.clientExchange}-${this.dungeonID}`, `*.${pattern}`);
                }
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Unbinds a pattern from the queue of a client.
     * @param character Client that needs to be unbinded.
     * @param pattern  Key pattern.
     */
    async unbindClientQueue(character: string, pattern: string): Promise<void> {
        if (this.isConnected()) {
            try {
                const token = this.characterTokenTranslation(character);
                if (token) {
                    await this.channel!.unbindQueue(`${this.dungeonID}-${token}`, `${this.clientExchange}-${this.dungeonID}`, `*.${pattern}`);
                }
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Sends action to specified token.
     * used to prevent multiple identical characters
     * @param token token of user instance.
     * @param action Action to send.
     * @param data Data to send.
     */
     async sendActionToToken(token: string, action: string, data: any) {
        this.sendToToken(token, {
            action: action,
            data: data
        });
    }

    /**
     * Sends action to specified token.
     * used to prevent multiple identical characters
     * @param token token of user instance.
     * @param action Action to send.
     * @param data Data to send.
     */
     async sendToToken(token: string, msg: any) {
        if (this.isConnected()) {
            try {
                // this.clientChannel.publish(this.clientExchange, `${fork}.broadcast`, Buffer.from(msg));
                this.channel!.sendToQueue(`${this.dungeonID}-${token}`, Buffer.from(JSON.stringify(msg)));
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Sends action to specified client.
     * @param character Client that receives message.
     * @param action Action to send.
     * @param msg Message to send.
     */
    async sendActionToClient(character: string, action: string, data: any) {
        this.sendToClient(character, {
            action: action,
            data: data
        });
    }

    /**
     * Sends message to specified client.
     * @param character Client that receives message.
     * @param msg Message to send.
     */
     async sendToClient(character: string, msg: any): Promise<void> {
        if (this.isConnected()) {
            try {
                // this.clientChannel.publish(this.clientExchange, `${fork}.broadcast`, Buffer.from(msg));
                this.channel!.publish(this.clientExchange, `${this.dungeonID}.user.${character}`, Buffer.from(JSON.stringify(msg)));
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Sends action to everyone in dungeon.
     * @param action Action to send.
     * @param data Data to send.
     */
    async broadcastAction(action: string, data: any) {
        this.broadcast({
            action: action,
            data: data
        });
    }

    /**
     * Sends message to everyone in dungeon.
     * @param msg Message to send.
     */
    async broadcast(msg: any): Promise<void> {
        if (this.isConnected()) {
            try {
                this.channel!.publish(this.clientExchange, `${this.dungeonID}.broadcast`, Buffer.from(JSON.stringify(msg)));
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Sends action to ClientExchange with a routingKey.
     * @param routingKey Key that specifies receiver(s) (e.g. roomID).
     * @param action Action to send.
     * @param data Data to send.
     */
     async sendActionWithRouting(routingKey: string, action: string, data: any) {
        this.sendWithRouting(routingKey, {
            action: action,
            data: data
        });
    }

    /**
     * Sends message to ClientExchange with a routingKey.
     * The routingKey is used to determine which clients receive the message.
     * @param routingKey Key that specifies receiver(s) (e.g. roomID).
     * @param msg Message to send.
     */
     async sendWithRouting(routingKey: string, msg: any): Promise<void> {
        if (this.isConnected()) {
            try {
                this.channel!.publish(this.clientExchange, `${this.dungeonID}.${routingKey}`, Buffer.from(JSON.stringify(msg)));
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Consumese messages coming from the clients.
     * @param onMessage Function that processes incoming messages.
     */
    async consume(onMessage: (msg: amqplib.ConsumeMessage) => void): Promise<void> {
        if (this.isConnected()) {
            try {
                this.channel!.consume(this.dungeonID, (msg: amqplib.ConsumeMessage | null) => {
                    if (msg !== null) {
                        onMessage(msg);
                        this.channel?.ack(msg);
                    }
                });
            } catch (err) {
                throw err;
            }
        }
    }
}

