import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../app.module';
import { InterpreterModule } from 'src/interpreter/interpreter.module';

import { CONFIG } from './common.config';

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
    include: [AppModule, InterpreterModule],
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
