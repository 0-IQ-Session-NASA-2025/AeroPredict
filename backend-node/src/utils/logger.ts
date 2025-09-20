import chalk from 'chalk';
import winston from 'winston';

export class Logger {
    private static instance: Logger;
    private readonly logger: winston.Logger;

    private constructor() {
        const colorfulFormat = winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf(({ level, message, timestamp }) => {
                const levelColors = {
                    error: chalk.red,
                    warn: chalk.yellow,
                    info: chalk.blue,
                    verbose: chalk.cyan,
                    debug: chalk.magenta
                };

                const colorFn = levelColors[level as keyof typeof levelColors] || chalk.white;
                const coloredLevel = colorFn(level.toUpperCase());
                const coloredTimestamp = chalk.gray(`[${timestamp}]`);
                
                return `${coloredTimestamp} ${coloredLevel}: ${message}`;
            })
        );
        
        const transports = [];
        if (process.env.NODE_ENV !== 'production') {
            transports.push(new winston.transports.Console(
                {
                    format: colorfulFormat
                }
            ));
        }
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [...transports,
            new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'log/combined.log' }),
            ],
        });

    }

    public static getInstance(): Logger {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
    public object(message: any): void {
        this.logger.info(JSON.stringify(message));
    }

    public log(level: string, message: string): void {
        this.logger.log(level, message);
    }
    
}
