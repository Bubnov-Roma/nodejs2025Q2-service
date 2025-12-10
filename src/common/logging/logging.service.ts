import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.TRANSIENT })
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
    this.maxFileSize = parseInt(process.env.MAX_LOG_FILE_SIZE || '5120', 10); // KB
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
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
          const rotatedFile = filePath.replace('.log', `-${timestamp}.log`);
          fs.renameSync(filePath, rotatedFile);
        }
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }

  private writeToFile(filePath: string, message: string) {
    try {
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
      ? `${formattedMessage}\n${trace}`
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
}
