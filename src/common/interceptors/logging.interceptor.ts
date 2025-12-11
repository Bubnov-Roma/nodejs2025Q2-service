import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body } = request;
    const now = Date.now();

    this.logger.logRequest(method, url, query, body);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;

          this.logger.logResponse(method, url, response.statusCode, delay);
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            {
              type: 'HTTP_ERROR',
              method,
              url,
              error: error.message,
              duration: `${delay}ms`,
            },
            error.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}
