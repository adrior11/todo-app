import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const startTime = Date.now();
        const logger = new AppLogger(true, 'info');

        logger.log(`[Incoming Request] ${method} ${url} - Body: ${JSON.stringify(body)}`);

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const responseTime = Date.now() - startTime;
                    logger.log(`[Outgoing Response] ${method} ${url} - Time: ${responseTime}ms - Response: ${JSON.stringify(data)}`);
                },
                error: (error) => {
                    const responseTime = Date.now() - startTime;
                    logger.error(`[Error Response] ${method} ${url} - Time: ${responseTime}ms - Error: ${JSON.stringify(error)}`);
                },
            })
        );
    }
}
