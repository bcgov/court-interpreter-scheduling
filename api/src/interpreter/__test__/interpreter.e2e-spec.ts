import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { factory, runSeeder, tearDownDatabase, useRefreshDatabase, useSeeding } from 'typeorm-seeding';
import { LoggerModule } from 'nestjs-pino';

import { InterpreterEntity } from '../entities/interpreter.entity';
import { InterpreterModule } from '../interpreter.module';
import CreateLanguage from 'src/database/seeds/1-create-language.seed';
import CreateInterpreter from 'src/database/seeds/2-create-interpreter.seed';
import { PaginateInterpreterQueryDto } from '../dto/paginate-interpreter-query.dto';
import { CreateInterpreterDto } from '../dto/create-interpreter.dto';
import { UpdateInterpreterDto } from '../dto/update-interpreter.dto';
import { InterpreterRO } from '../ro/interpreter.ro';

dotenv.config();

const EXAMPLE_INTERPRETER_UPLOAD = [
  {
    firstName: 'Steve',
    lastName: 'Stevenson',
    languages: [
      {
        languageName: 'Kurdish (sorani)',
        level: 3,
      },
      {
        languageName: 'Arabic',
        level: 3,
        commentOnLevel: null,
      },
    ],
    bookings: [],
    city: 'Richmond',
    province: 'BC',
  },
  {
    firstName: 'Jane',
    lastName: 'Janeson',
    languages: [
      {
        languageName: 'Japanese',
        level: 2,
        commentOnLevel: null,
      },
    ],
    city: 'Vancouver',
    province: 'BC',
  },
];

describe('interpreter', () => {
  let app: INestApplication;
  let interpreterRepository: Repository<InterpreterEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        InterpreterModule,
        LoggerModule.forRoot(),
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

        const languages = body.data.map((intp: InterpreterEntity) => intp.languages).flat();
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
        languages: [{ languageName: 'French', level: 3, commentOnLevel: 'comment' }],
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
      let interpreter = await interpreterRepository.findOne(createInterpreter.id);
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
      let interpreter = await interpreterRepository.findOne(createInterpreter.id);
      expect(interpreter).toBeDefined();
      expect(createInterpreter.id).toBe(interpreter.id);

      /**
       * update interpreter
       */
      const updateInterpreterDto: UpdateInterpreterDto = {
        firstName: 'update firstname',
      };
      const { status } = await request(app.getHttpServer())
        .patch('/interpreter/:id'.replace(':id', createInterpreter.id.toString()))
        .send(updateInterpreterDto);
      expect(status).toBe(HttpStatus.OK);

      interpreter = await interpreterRepository.findOne(createInterpreter.id);
      expect(interpreter).toBeDefined();
      expect(interpreter.firstName).toBe(updateInterpreterDto.firstName);
    });
  });

  describe('upload', () => {
    it('should create new interpreters', async () => {
      const resp = await request(app.getHttpServer())
        .post('/interpreter/upload')
        .send(EXAMPLE_INTERPRETER_UPLOAD);
      const body = resp.body as InterpreterRO[];
      expect(body.length).toEqual(2);
      expect(body[0].firstName).toEqual('Steve');
      expect(body[1].firstName).toEqual('Jane');
      expect(body[0].id).toBeTruthy;
    });

    it('should create new interpreters with anonymisation', async () => {
      const resp = await request(app.getHttpServer())
        .post('/interpreter/upload?anonymise=true')
        .send(EXAMPLE_INTERPRETER_UPLOAD);
      const body = resp.body as InterpreterRO[];
      expect(body.length).toEqual(2);
      expect(body[0].firstName).not.toEqual('Steve');
      expect(body[0].firstName).toBeTruthy;
      expect(body[1].firstName).not.toEqual('Jane');
      expect(body[0].firstName).toBeTruthy;

      // Adds new values for anonymisation
      expect(body[0].email).toBeTruthy;
    });

    it('should update and anonymise existing interpreters', async () => {
      const resp1 = await request(app.getHttpServer())
        .post('/interpreter/upload')
        .send(EXAMPLE_INTERPRETER_UPLOAD);
      const [personA1, personB1] = resp1.body as InterpreterRO[];
      expect(personA1.firstName).toEqual('Steve');
      expect(personB1.firstName).toEqual('Jane');
      expect(personA1.email).toBeFalsy;

      const uploadA2 = { ...EXAMPLE_INTERPRETER_UPLOAD[0], id: personA1.id };
      const uploadB2 = { ...EXAMPLE_INTERPRETER_UPLOAD[1], id: personB1.id };

      const resp2 = await request(app.getHttpServer())
        .post('/interpreter/upload?anonymise=true')
        .send([uploadA2, uploadB2]);
      const [personA2, personB2] = resp2.body as InterpreterRO[];

      expect(personA2.id).toEqual(personA1.id);
      expect(personB2.id).toEqual(personB1.id);

      expect(personA2.firstName).toBeTruthy;
      expect(personA2.firstName).not.toEqual(personA1.firstName);

      expect(personB2.firstName).toBeTruthy;
      expect(personB2.firstName).not.toEqual(personB1.firstName);

      // Anonymisation adds extra fields if they don't exist
      expect(personA2.email).toBeTruthy;

      // Double check the record is overwritten
      const personA3: InterpreterRO = await request(app.getHttpServer())
        .get(`/interpreter/${personA1.id}`)
        .send()
        .then(r => r.body);
      expect(personA3.firstName).toEqual(personA2.firstName);
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
