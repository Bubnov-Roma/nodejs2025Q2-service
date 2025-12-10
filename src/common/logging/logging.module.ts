import { Global, Module } from '@nestjs/common';
import { CustomLoggingService } from './logging.service';

@Global()
@Module({
  providers: [CustomLoggingService],
  exports: [CustomLoggingService],
})
export class LoggingModule {}
