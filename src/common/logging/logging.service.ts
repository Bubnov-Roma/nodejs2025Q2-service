import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLoggingService implements LoggerService {
  private logLevel: number;
  private maxFileSize: number;
  private logsDir = path.join(process.cwd(), 'logs');
  private logFile = path.join(this.logsDir, 'app.log');
  private errorLogFile = path.join(this.logsDir, 'error.log');

  private levels = {
    error: 1,
    warn: 2,
    log: 3,
    debug: 4,
    verbose: 5,
  };

  constructor() {
    this.logLevel = parseInt(process.env.LOG_LEVEL || '3', 10);
    this.maxFileSize = parseInt(process.env.MAX_LOG_FILE_SIZE || '5120', 10);
    this.ensureLogDirectory();
    this.clearLogsIfNeeded();
    this.logInitialization();
  }

  private ensureLogDirectory() {
    try {
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
        console.log(`Created logs directory: ${this.logsDir}`);
      }
    } catch (error) {
      console.error('Error creating logs directory:', error);
      this.logsDir = process.cwd();
      this.logFile = path.join(this.logsDir, 'app.log');
      this.errorLogFile = path.join(this.logsDir, 'error.log');
    }
  }

  private clearLogsIfNeeded() {
    const shouldClear = process.env.CLEAR_LOGS_ON_STARTUP === 'true';
    if (shouldClear) {
      try {
        if (fs.existsSync(this.logFile)) {
          fs.writeFileSync(this.logFile, '', 'utf8');
          console.log('Cleared app.log');
        }
        if (fs.existsSync(this.errorLogFile)) {
          fs.writeFileSync(this.errorLogFile, '', 'utf8');
          console.log('Cleared error.log');
        }
        this.removeOldRotatedLogs();
      } catch (error) {
        console.error('Failed to clear logs:', error);
      }
    }
  }

  private removeOldRotatedLogs() {
    try {
      const files = fs.readdirSync(this.logsDir);
      const rotatedFiles = files.filter(
        (file) =>
          (file.startsWith('app-') || file.startsWith('error-')) &&
          file.endsWith('.log'),
      );
      rotatedFiles.forEach((file) => {
        const filePath = path.join(this.logsDir, file);
        fs.unlinkSync(filePath);
        console.log(`Removed old log file: ${file}`);
      });
    } catch (error) {
      console.error('Failed to remove old rotated logs:', error);
    }
  }

  private logInitialization() {
    const initMessage = this.formatMessage(
      'log',
      `Logging initialized - Level: ${this.logLevel}, Max file size: ${this.maxFileSize}KB`,
      'LoggingService',
    );
    console.log(initMessage);
  }
  private shouldLog(level: string): boolean {
    return this.levels[level] <= this.logLevel;
  }

  private rotateLogFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const fileSizeInKB = stats.size / 1024;

        if (fileSizeInKB > this.maxFileSize) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const ext = path.extname(filePath);
          const basename = path.basename(filePath, ext);
          const dirname = path.dirname(filePath);
          const rotatedFile = path.join(
            dirname,
            `${basename}-${timestamp}${ext}`,
          );
          fs.renameSync(filePath, rotatedFile);
          const rotationMessage = `Log file rotated: ${path.basename(filePath)} -> ${path.basename(rotatedFile)} (Size: ${fileSizeInKB.toFixed(2)}KB)`;
          console.log(
            this.formatMessage('log', rotationMessage, 'LogRotation'),
          );
        }
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }

  private writeToFile(filePath: string, message: string) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.rotateLogFile(filePath);
      fs.appendFileSync(filePath, message + '\n', 'utf8');
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  private formatMessage(level: string, message: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    return `${timestamp} [${level.toUpperCase()}] ${ctx} ${msg}`;
  }

  log(message: any, context?: string) {
    if (!this.shouldLog('log')) return;
    const formattedMessage = this.formatMessage('log', message, context);
    console.log(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  error(message: any, trace?: string, context?: string) {
    if (!this.shouldLog('error')) return;
    const formattedMessage = this.formatMessage('error', message, context);
    const fullMessage = trace
      ? `${formattedMessage}\nStack trace:\n${trace}`
      : formattedMessage;
    console.error(fullMessage);
    this.writeToFile(this.logFile, fullMessage);
    this.writeToFile(this.errorLogFile, fullMessage);
  }

  warn(message: any, context?: string) {
    if (!this.shouldLog('warn')) return;
    const formattedMessage = this.formatMessage('warn', message, context);
    console.warn(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  debug(message: any, context?: string) {
    if (!this.shouldLog('debug')) return;
    const formattedMessage = this.formatMessage('debug', message, context);
    console.debug(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  verbose(message: any, context?: string) {
    if (!this.shouldLog('verbose')) return;
    const formattedMessage = this.formatMessage('verbose', message, context);
    console.log(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  logRequest(method: string, url: string, query: any, body: any) {
    this.log(
      {
        type: 'HTTP_REQUEST',
        method,
        url,
        query,
        body: this.sanitizeBody(body),
      },
      'HTTP',
    );
  }

  logResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ) {
    this.log(
      {
        type: 'HTTP_RESPONSE',
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
      },
      'HTTP',
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'oldPassword',
      'newPassword',
      'refreshToken',
      'accessToken',
    ];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    return sanitized;
  }
}
