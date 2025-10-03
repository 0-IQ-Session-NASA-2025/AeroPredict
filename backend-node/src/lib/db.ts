import mongoose, { Connection } from "mongoose";
import { Logger } from "../utils/logger";

type LocalDbOptions = {
    host: string;
    port: number;
    database: string;
    user?: string;
    password?: string;
}

type CloudDbOptions = {
    connectionString: string;
}

export class DbConnector {
    private static readonly logger: Logger = Logger.getInstance();
    private static connection: Connection;

    public static async connectLocal(options: LocalDbOptions): Promise<Connection> {
        if (this.connection) {
            this.logger.info('MongoDB already connected');
            return this.connection;
        }

        try {
            const connectionString = options.user && options.password
                ? `mongodb://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}`
                : `mongodb://${options.host}:${options.port}/${options.database}`;

            const mongoose_instance = await mongoose.connect(connectionString);
            this.connection = mongoose_instance.connection;

            this.setupConnectionHandlers('Local MongoDB');
            return this.connection;
        } catch (error) {
            this.logger.error(`Failed to connect to local MongoDB: ${error}`);
            throw error;
        }
    }

    public static async connectCloud(options: CloudDbOptions): Promise<Connection> {
        if (this.connection) {
            this.logger.info('MongoDB already connected');
            return this.connection;
        }

        try {
            const mongoose_instance = await mongoose.connect(options.connectionString);
            this.connection = mongoose_instance.connection;

            this.setupConnectionHandlers('MongoDB Atlas');
            return this.connection;
        } catch (error) {
            this.logger.error(`Failed to connect to MongoDB Atlas: ${error}`);
            throw error;
        }
    }

    public static async connect(): Promise<Connection> {
        const useCloud = process.env.USE_CLOUD_DB === 'true';

        if (useCloud) {
            if (!process.env.DB_URL) {
                throw new Error('DB_URL environment variable is required for cloud connection');
            }
            this.logger.info('Connecting to MongoDB Atlas...');
            return this.connectCloud({ connectionString: process.env.DB_URL });
        } else {
            const host = process.env.DB_HOST || 'localhost';
            const port = parseInt(process.env.DB_PORT || '27017');
            const database = process.env.DB_NAME || 'aeropredict';
            const user = process.env.DB_USER;
            const password = process.env.DB_PASSWORD;

            this.logger.info('Connecting to local MongoDB...');
            return this.connectLocal({ host, port, database, user, password });
        }
    }

    private static setupConnectionHandlers(connectionType: string): void {
        this.connection.on('connected', () => {
            this.logger.info(`${connectionType} connected successfully`);
        });

        this.connection.on('error', (err) => {
            this.logger.error(`${connectionType} connection error: ${err}`);
        });

        this.connection.on('disconnected', () => {
            this.logger.info(`${connectionType} disconnected`);
        });

        this.logger.info(`${connectionType} connection established`);
    }

    public static disconnect(): void {
        if (this.connection) {
            this.connection.close();
            this.logger.info('MongoDB connection closed');
        }
    }
}
