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

    this.logger.log(
      {
        type: 'REQUEST',
        method,
        url,
        query,
        body: this.sanitizeBody(body),
      },
      'HTTP',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;

          this.logger.log(
            {
              type: 'RESPONSE',
              method,
              url,
              statusCode: response.statusCode,
              duration: `${delay}ms`,
            },
            'HTTP',
          );
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            {
              type: 'RESPONSE_ERROR',
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

  private sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    if (sanitized.password) {
      sanitized.password = '***';
    }
    if (sanitized.oldPassword) {
      sanitized.oldPassword = '***';
    }
    if (sanitized.newPassword) {
      sanitized.newPassword = '***';
    }
    return sanitized;
  }
}
