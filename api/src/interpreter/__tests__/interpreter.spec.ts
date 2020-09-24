import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { setupEnvironment, clearDB } from '../../../test/util/testUtils';
import { InterpreterService } from 'src/interpreter/interpreter.service';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';

describe('Contact service', () => {
  let module: TestingModule;
  let app: INestApplication;
  let db: DatabaseService;
  let interpreterService: InterpreterService;
  let interpreter: InterpreterEntity;

  const testInterpreter: Partial<InterpreterEntity> = {
    name: 'testinterpreter',
  };
  beforeAll(async () => {
    ({ module, app, db } = await setupEnvironment());

    interpreterService = app.get<InterpreterService>(InterpreterService);
  });
  beforeEach(async () => {
    interpreter = await interpreterService.create(interpreter);
  });

  afterEach(async () => {
    await clearDB(db.connection);
  });

  afterAll(async () => {
    await db.connection.close();
  });

  it('Interpreter service create creates a interpreter', async () => {
    expect(interpreter.name).toEqual(testInterpreter.name);
  });
});
