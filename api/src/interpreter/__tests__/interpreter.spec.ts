import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { setupEnvironment, clearDB } from 'src/utils/testUtils';
import { InterpreterService } from 'src/interpreter/interpreter.service';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { MockRepository } from 'src/utils/mock-repository';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateInterpreterDto } from '../dto/create-interpreter.dto';
class MockedInterpreterRepository extends MockRepository<InterpreterEntity> {}
class MockedLanguageRepository extends MockRepository<LanguageEntity> {}

describe('Contact service', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let interpreterService: InterpreterService;
  let interpreter: InterpreterEntity;

  const testInterpreter: Partial<CreateInterpreterDto> = {
    name: 'test interpreter',
  };

  beforeAll(async () => {
    const TestEnv = await setupEnvironment({
      providers: [
        InterpreterService,
        {
          provide: getRepositoryToken(InterpreterEntity),
          useClass: MockedInterpreterRepository,
        },
        {
          provide: getRepositoryToken(LanguageEntity),
          useClass: MockedLanguageRepository,
        },
      ],
    });
    db = TestEnv.db;
    app = TestEnv.app;

    interpreterService = app.get<InterpreterService>(InterpreterService);
  });

  beforeEach(async () => {
    interpreter = await interpreterService.create(testInterpreter);
  });

  afterEach(async () => {
    await clearDB(db.connection);
  });

  afterAll(async () => {
    await db.connection.close();
  });

  it('should be defined', () => {
    expect(interpreterService).toBeDefined();
  });

  it('Interpreter service create creates a interpreter', async () => {
    expect(interpreter.name).toEqual(testInterpreter.name);
  });
});
