import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { logger } from './common/middleware/logger.middleware';
import { CONFIG } from './common/common.config';
import { documentation } from './common/common.documentation';
import { ErrorExceptionFilter } from './common/filters/error-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1')
  app.enableCors();
  documentation(app);
  if (process.env.NODE_ENV !== 'production') {
    global['nestAppServer'] = app.getHttpServer();
  }

  // logger
  app.use(logger);
  Logger.log(`Running Court API in ${process.env.NODE_ENV} mode`);
  Logger.log(`attempting connection to db host: ${process.env.DB_HOST}`);

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
    }),
  );

  // exception filter
  app.useGlobalFilters(new ErrorExceptionFilter());
  await app.listen(CONFIG.applicationPort);

  Logger.log(
    `Server running on http://localhost:${CONFIG.applicationPort}`,
    'Bootstrap',
  );
}
bootstrap();
