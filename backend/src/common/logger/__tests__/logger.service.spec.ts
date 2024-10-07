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

    it('should log an info message', () => {
        const message = 'Test info message';
        const spy = jest.spyOn(logger['logger'], 'info');
        logger.log(message);
        expect(spy).toHaveBeenCalledWith(message);
    });

    it('should log an error message', () => {
        const message = 'Test error log';
        const spy = jest.spyOn(logger['logger'], 'error');
        logger.error(message);
        expect(spy).toHaveBeenCalledWith(message);
    });

    it('should log a warn message', () => {
        const message = 'Test warn log';
        const spy = jest.spyOn(logger['logger'], 'warn');
        logger.warn(message);
        expect(spy).toHaveBeenCalledWith(message);
    });

    it('should log a debug message', () => {
        const message = 'Test debug log';
        const spy = jest.spyOn(logger['logger'], 'debug');
        logger.debug(message);
        expect(spy).toHaveBeenCalledWith(message);
    });
});
