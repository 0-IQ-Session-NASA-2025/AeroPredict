import mongoose, { Connection, Mongoose } from "mongoose";
import { Logger } from "../utils/logger";

type DbConnectorOptions = {
    host: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
}

export class DbConnector {
    private static readonly logger: Logger = Logger.getInstance();
    private static connection: Connection;

    public static async connect(options: DbConnectorOptions): Promise<Connection> {
        if (this.connection) {
            this.logger.info('MongoDB already connected')
            return this.connection;
        }
        const {connection} = await  mongoose.connect(options.host);
        this.connection = connection
        this.connection.on('connected', () => {
            this.logger.info('MongoDB connected');
        });

        this.connection.on('error', (err) => {
            this.logger.error(`MongoDB connection error: ${err}`);
        });

        this.connection.on('disconnected', () => {
            this.logger.info('MongoDB disconnected');
        });

        return this.connection;
    }

    public static disconnect(): void {
        if (this.connection) {
            this.connection.close();
            this.logger.info('MongoDB connection closed');
        }
    }
}
