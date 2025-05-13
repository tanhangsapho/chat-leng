import amqp, { Connection, Channel, Options, ConsumeMessage } from "amqplib";
import { getConfig, logger } from "../utils";

const cfg = getConfig(process.env.NODE_ENV);
const URL =
  cfg.env === "development"
    ? `amqp://${cfg.Rabbithost}`
    : `amqp://${cfg.user}:${cfg.password}@${cfg.Rabbithost}/${cfg.vhost}`;

export class RabbitMQ {
  private static instance: RabbitMQ;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQ {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
    }
    return RabbitMQ.instance;
  }

  public async getConnection(): Promise<Connection> {
    if (this.connection) return this.connection;

    this.connection = await amqp.connect(URL);
    this.connection.on("error", (err) => {
      logger.error("RabbitMQ connection error", { err });
      this.connection = this.channel = null;
    });
    this.connection.on("close", () => {
      logger.warn("RabbitMQ connection closed");
      this.connection = this.channel = null;
    });

    logger.info("RabbitMQ connected");
    return this.connection;
  }

  public async getChannel(): Promise<Channel> {
    if (this.channel) return this.channel;
    const conn = await this.getConnection();
    this.channel = await conn.createChannel();
    logger.info("RabbitMQ channel created");
    return this.channel;
  }

  public async publish(
    exchange: string,
    routingKey: string,
    message: any,
    opts: Options.Publish = {}
  ): Promise<void> {
    const ch = await this.getChannel(); // ch is a Channel
    await ch.assertExchange(exchange, "topic", { durable: false });
    ch.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      opts
    );
    logger.debug("RabbitMQ published", { exchange, routingKey, message });
  }

  public async subscribe(
    exchange: string,
    routingKeys: string[],
    handler: (rk: string, msg: any) => void
  ): Promise<void> {
    const ch = await this.getChannel(); // ch is a Channel
    await ch.assertExchange(exchange, "topic", { durable: false });

    const { queue } = await ch.assertQueue("", { exclusive: true });
    for (const rk of routingKeys) {
      await ch.bindQueue(queue, exchange, rk);
    }

    await ch.consume(
      queue,
      (raw: ConsumeMessage | null) => {
        if (!raw) return;
        let parsed;
        try {
          parsed = JSON.parse(raw.content.toString());
        } catch (err) {
          logger.error("Failed to parse RabbitMQ message", {
            err,
            raw: raw.content.toString(),
          });
          return;
        }
        handler(raw.fields.routingKey, parsed);
      },
      { noAck: true }
    );
    logger.info("RabbitMQ subscribed", { exchange, routingKeys });
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      logger.info("RabbitMQ channel closed");
    }
    if (this.connection) {
      await this.connection.close();
      logger.info("RabbitMQ connection closed");
    }
    this.channel = this.connection = null;
  }
}

export const rabbit = RabbitMQ.getInstance();
