import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../app.module';
import { CONFIG } from './common.config';

import { InterpreterModule } from 'src/interpreter/interpreter.module';
import { LanguageModule } from 'src/language/language.module';
import { LocationModule } from 'src/location/location.module';
import { BookingModule } from 'src/booking/booking.module';

export const documentation = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(CONFIG.general.title)
    .setDescription(CONFIG.general.description)
    .setVersion(
      `${CONFIG.version.major}.${CONFIG.version.minor}.${CONFIG.version.patch}`,
    )
    .addBearerAuth()
    .build();

  const baseDocument = SwaggerModule.createDocument(app, options, {
    include: [
      AppModule,
      InterpreterModule,
      LanguageModule,
      LocationModule,
      BookingModule,
    ],
  });

  SwaggerModule.setup('api', app, baseDocument, {
    swaggerOptions: {
      docExpansion: 'none',
      displayRequestDuration: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
  });
};
