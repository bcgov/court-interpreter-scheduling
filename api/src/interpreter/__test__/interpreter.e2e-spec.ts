import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  factory,
  runSeeder,
  tearDownDatabase,
  useRefreshDatabase,
  useSeeding,
} from 'typeorm-seeding';

import { InterpreterEntity } from '../entities/interpreter.entity';
import { InterpreterModule } from '../interpreter.module';
import CreateLanguage from 'src/database/seeds/1-create-language.seed';
import CreateInterpreter from 'src/database/seeds/2-create-interpreter.seed';
import { PaginateInterpreterQueryDto } from '../dto/paginate-interpreter-query.dto';
import { CreateInterpreterDto } from '../dto/create-interpreter.dto';
import { UpdateInterpreterDto } from '../dto/update-interpreter.dto';

dotenv.config();

describe('interpreter', () => {
  let app: INestApplication;
  let interpreterRepository: Repository<InterpreterEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        InterpreterModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          username: process.env.POSTGRESQL_USER,
          password: process.env.POSTGRESQL_PASSWORD,
          database: process.env.DB_TEST_DATABASE,
          entities: ['./**/*.entity.ts'],
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        disableErrorMessages: false,
      }),
    );
    interpreterRepository = module.get(getRepositoryToken(InterpreterEntity));

    /** seeding */
    await useRefreshDatabase();
    await useSeeding();
    await runSeeder(CreateLanguage);

    await app.init();
  });

  describe('search interpreters', () => {
    beforeAll(async () => {
      await useSeeding();
      await runSeeder(CreateInterpreter);
    });

    describe('search by level 1', () => {
      it('should only return interpreters with language level 1', async () => {
        const dto = new PaginateInterpreterQueryDto();
        dto.level = [1];

        const { body } = await request
          .agent(app.getHttpServer())
          .post('/interpreter/search')
          .send(dto)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.OK);

        const languages = body.data
          .map((intp: InterpreterEntity) => intp.languages)
          .flat();
        expect(languages).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              level: 1,
            }),
          ]),
        );

        expect(languages).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              level: 2,
            }),
          ]),
        );

        expect(languages).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              level: 3,
            }),
          ]),
        );

        expect(languages).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              level: 4,
            }),
          ]),
        );
      });
    });
  });

  describe('create an interpreter', () => {
    it('can creates a interpreter', async () => {
      const createInterpreterDto: CreateInterpreterDto = {
        firstName: 'first',
        lastName: 'last',
        languages: [
          { languageName: 'French', level: 3, commentOnLevel: 'comment' },
        ],
      };

      const { body } = await request
        .agent(app.getHttpServer())
        .post('/interpreter')
        .send(createInterpreterDto)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED);

      expect(body.id).toEqual(expect.any(Number));
      expect(body.firstName).toBe(createInterpreterDto.firstName);
      expect(body.lastName).toBe(createInterpreterDto.lastName);
      expect(body.languages).toEqual(createInterpreterDto.languages);
    });

    it('can creates new language when it is not in database', async () => {
      const createInterpreterDto: CreateInterpreterDto = {
        firstName: 'first',
        lastName: 'last',
        languages: [
          { languageName: 'French', level: 3, commentOnLevel: 'comment' },
          {
            languageName: 'Rarelanguage',
            level: 3,
            commentOnLevel: 'comment',
          },
        ],
      };

      const { body } = await request
        .agent(app.getHttpServer())
        .post('/interpreter')
        .send(createInterpreterDto)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED);

      expect(body.id).toEqual(expect.any(Number));
      expect(body.firstName).toBe(createInterpreterDto.firstName);
      expect(body.lastName).toBe(createInterpreterDto.lastName);
      expect(body.languages).toEqual(createInterpreterDto.languages);
    });
  });

  describe('remove an interpreter', () => {
    it('can delete interpreter by id', async () => {
      /**
       * create interpreter and check if exists
       */
      const createInterpreter = await factory(InterpreterEntity)().create();
      let interpreter = await interpreterRepository.findOne(
        createInterpreter.id,
      );
      expect(interpreter).toBeDefined();
      expect(createInterpreter.id).toBe(interpreter.id);

      /**
       * delete interpreter
       */
      const { status } = await request(app.getHttpServer()).delete(
        '/interpreter/:id'.replace(':id', createInterpreter.id.toString()),
      );
      expect(status).toBe(HttpStatus.OK);

      interpreter = await interpreterRepository.findOne(createInterpreter.id);
      expect(interpreter).toBeUndefined();
    });
  });

  describe('update an interpreter', () => {
    it('can update an interpreter by id', async () => {
      /**
       * create interpreter and check if exists
       */
      const createInterpreter = await factory(InterpreterEntity)().create();
      let interpreter = await interpreterRepository.findOne(
        createInterpreter.id,
      );
      expect(interpreter).toBeDefined();
      expect(createInterpreter.id).toBe(interpreter.id);

      /**
       * update interpreter
       */
      const updateInterpreterDto: UpdateInterpreterDto = {
        firstName: 'update firstname',
      };
      const { status } = await request(app.getHttpServer())
        .patch(
          '/interpreter/:id'.replace(':id', createInterpreter.id.toString()),
        )
        .send(updateInterpreterDto);
      expect(status).toBe(HttpStatus.OK);

      interpreter = await interpreterRepository.findOne(createInterpreter.id);
      expect(interpreter).toBeDefined();
      expect(interpreter.firstName).toBe(updateInterpreterDto.firstName);
    });
  });

  afterEach(async () => {
    await interpreterRepository.query(`DELETE FROM interpreter;`);
  });

  afterAll(async () => {
    await tearDownDatabase();
    await app.close();
  });
});
