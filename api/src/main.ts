import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';

import { CONFIG } from './common/common.config';
import { documentation } from './common/common.documentation';
import { ErrorExceptionFilter } from './common/filters/error-exception.filter';
import { isProduction } from './utils';
import { LocationFetchScheduleService } from './location/location-fetch-schedule.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');

  if (isProduction) {
    app.enableCors({
      origin: "https://justice.gov.bc.ca"
    });
  } else {
    app.enableCors({
      origin: "https://dev.justice.gov.bc.ca https://test.justice.gov.bc.ca https://justice.gov.bc.ca http://localhost:3000"
    });
  }
  app.use(bodyParser.json({ limit: '50mb' }));

  documentation(app);
  if (!isProduction) {
    global['nestAppServer'] = app.getHttpServer();
  }

  // logger
  const logger = app.get(Logger);
  app.useLogger(logger);
  logger.log(`Running Court API in ${process.env.NODE_ENV} mode`);
  logger.log(`Running Court Api in ${process.env.DEPLOYMENT_ENV} env`);
  logger.log(`attempting connection to db host: ${process.env.DB_HOST}`);

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
  const server = await app.listen(CONFIG.applicationPort);
  server.setTimeout(30 * 60 * 1000);

  // Call service
  const locationFetchService: LocationFetchScheduleService = app.get<LocationFetchScheduleService>(
    LocationFetchScheduleService,
  );
  if (locationFetchService) {
    await locationFetchService.fetchAndStoreLocation();
    logger.log(`Location service fetch [DONE]`);
  }

  logger.log(`Server running on http://localhost:${CONFIG.applicationPort}`, 'Bootstrap');
}
bootstrap();
