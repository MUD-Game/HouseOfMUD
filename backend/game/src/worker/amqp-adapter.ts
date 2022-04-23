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
    
    constructor(dungeonID: string, url: string, port: string, user: string, password: string, serverExchange: string, clientExchange: string) {
        this.dungeonID = dungeonID;
        this.url = url;
        this.port = port;
        this.user = user;
        this.password = password;
        this.serverExchange = serverExchange;
        this.clientExchange = clientExchange;
    }

    isConnected(): boolean {
        return this.connection !== undefined && this.channel !== undefined;
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
            this.channel?.close();
            this.channel = undefined;

            this.connection?.close();
            this.connection = undefined;
            throw err;
        }
    }

    async close(): Promise<void> {
        if (this.isConnected()) {
            try {
                await this.channel!.deleteQueue(this.dungeonID);

                await this.channel!.deleteExchange(`${this.clientExchange}-${this.dungeonID}`);

                await this.channel!.close();
                this.channel = undefined;

                await this.connection!.close();
                this.connection = undefined;
            } catch (err) {
                throw err;
            }
        }   
    }

    /**
     * Binds new queue with dungeon specific client exchange. Client subscribes to that queue to receive messages.
     * @param user User to connect.
     */
    async initClient(user: string): Promise<void> {
        if (this.isConnected()) {
            try {
                await this.channel!.assertQueue(`${this.dungeonID}-${user}`, { autoDelete: true });
                await this.channel!.bindQueue(`${this.dungeonID}-${user}`, `${this.clientExchange}-${this.dungeonID}`, `*.user.${user}`);
                await this.channel!.bindQueue(`${this.dungeonID}-${user}`, `${this.clientExchange}-${this.dungeonID}`, `*.broadcast`);
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Binds queue that client is subscribed to with new key. Is used when client goes to a room of a dungeon.
     * @param user Client that needs to be binded.
     * @param pattern Key pattern.
     */
    async bindClientQueue(user: string, pattern: string): Promise<void> {
        if (this.isConnected()) {
            try {
                await this.channel!.bindQueue(`${this.dungeonID}-${user}`, `${this.clientExchange}-${this.dungeonID}`, `*.${pattern}`);
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Unbinds queue with a specific key. Is used when client leaves a room of a dungeon.
     * @param user Client that needs to be binded.
     * @param pattern  Key pattern.
     */
    async unbindClientQueue(user: string, pattern: string): Promise<void> {
        if (this.isConnected()) {
            try {
                await this.channel!.unbindQueue(`${this.dungeonID}-${user}`, `${this.clientExchange}-${this.dungeonID}`, `*.${pattern}`);
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Sends message to specified client. ANPASSEN
     * @param user Client that receives message.
     * @param msg Message to send.
     */
    async sendToClient(user: string, msg: any): Promise<void> {
        if (this.isConnected()) {
            try {
                // this.clientChannel.publish(this.clientExchange, `${fork}.broadcast`, Buffer.from(msg));
                this.channel!.publish(this.clientExchange, `${this.dungeonID}.user.${user}`, Buffer.from(JSON.stringify(msg)));
            } catch (err) {
                throw err;
            }
        }
    }

    /**
     * Sends message to everyone in dungeon. ANPASSEN
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
     * Sends message to queues with specified key. ANPASSEN
     * @param routingKey Key that specifies receiver (room).
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
     * Consumese messages from client.
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

