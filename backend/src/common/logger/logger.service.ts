import { createLogger, transports, Logger } from 'winston';
import { jsonFormatter, simpleFormatter } from './formatters';

export class AppLogger {
    private logger: Logger;

    constructor(humanFriendly: boolean = true, logLevel: string = 'info') {
        const format = humanFriendly ? simpleFormatter : jsonFormatter;

        this.logger = createLogger({
            level: logLevel,
            format,
            transports: [new transports.Console()],
        });
    }

    log(message: string): void {
        this.logger.info(message);
    }

    error(message: string): void {
        this.logger.error(message);
    }

    warn(message: string): void {
        this.logger.warn(message);
    }

    debug(message: string): void {
        this.logger.debug(message);
    }
}
