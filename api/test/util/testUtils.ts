import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/database/database.service';

export const setupEnvironment = async (): Promise<{
  module: TestingModule;
  app: INestApplication;
  db: DatabaseService;
}> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = module.createNestApplication();
  const db = module.get<DatabaseService>(DatabaseService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.init();

  return { module, app, db };
};

export const clearDB = async (connection: Connection): Promise<void> => {
  try {
    const entities = connection.entityMetadatas;
    const blacklist = ['user_status', 'user_type'];
    for (const entity of entities) {
      if (!blacklist.includes(entity.tableName)) {
        const repository = await connection.getRepository(entity.name);
        await repository.query(`DELETE FROM "${entity.tableName}";`);
      }
    }
  } catch (err) {
    throw new Error(`ERROR: Cleaning test db: ${err}`);
  }
};

export const closeDB = async (connection: Connection): Promise<void> => {
  if (connection.isConnected) {
    await connection.close();
  }
};
