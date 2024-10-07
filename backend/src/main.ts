import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppLogger } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:4321', 'http://127.0.0.1:4321'],
        methods: 'GET,POST,PATCH,DELETE',
        allowedHeaders: 'Content-Type,Authorization'
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.listen(3000);

    const logger = new AppLogger(true, 'info');
    logger.log('Application started');
}
bootstrap();
