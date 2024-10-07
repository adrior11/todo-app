// FIX:
import { AppLogger } from '../logger.service';

jest.mock('winston', () => ({
    createLogger: jest.fn().mockReturnValue({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    }),
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        json: jest.fn(),
        printf: jest.fn(),
    },
    transports: {
        Console: jest.fn(),
    },
}));

describe('AppLogger', () => {
    let logger: AppLogger;

    const winston = require('winston');

    beforeEach(() => {
        logger = new AppLogger(true, 'info');
    });

    it('should log a info message', () => {
        const message = 'Test info message';
        const spy = jest.spyOn(winston.createLogger().transports[0], 'info');
        logger.log(message);

        expect(spy).toHaveBeenCalledWith(message);
    });

    it('should log a error message', () => {
        const message = 'Test error log';
        const spy = jest.spyOn(winston.createLogger().transports[0], 'error');
        logger.log(message);

        expect(spy).toHaveBeenCalledWith(message);
    });

    it('should log a warn message', () => {
        const message = 'Test warn log';
        const spy = jest.spyOn(winston.createLogger().transports[0], 'warn');
        logger.log(message);

        expect(spy).toHaveBeenCalledWith(message);
    });

    it('should log a debug message', () => {
        const message = 'Test debug log';
        const spy = jest.spyOn(winston.createLogger().transports[0], 'debug');
        logger.log(message);

        expect(spy).toHaveBeenCalledWith(message);
    })
});
