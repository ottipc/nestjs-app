import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as winston from 'winston';

// Adapter, der NestJS-Logger-Methoden auf Winston mappt
class WinstonLoggerAdapter {
  private winstonLogger: winston.Logger;
  constructor(winstonLogger: winston.Logger) {
    this.winstonLogger = winstonLogger;
  }
  log(message: any, context?: string) {
    this.winstonLogger.info(message, { context });
  }
  error(message: any, trace?: string, context?: string) {
    this.winstonLogger.error(message, { trace, context });
  }
  warn(message: any, context?: string) {
    this.winstonLogger.warn(message, { context });
  }
  debug?(message: any, context?: string) {
    this.winstonLogger.debug(message, { context });
  }
  verbose?(message: any, context?: string) {
    this.winstonLogger.verbose(message, { context });
  }
}

async function bootstrap() {
  const winstonLogger = winston.createLogger({
    level: 'info',
    levels: winston.config.npm.levels,
    transports: [new winston.transports.Console()],
  });

  const loggerAdapter = new WinstonLoggerAdapter(winstonLogger);

  const app = await NestFactory.create(AppModule, {
    logger: loggerAdapter,
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('NestJS-App')
    .setDescription('API-Dokumentation der NestJS-App')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  loggerAdapter.log(`App lafft auf Port ${port}`);
}
bootstrap();
