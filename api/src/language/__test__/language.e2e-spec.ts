import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';

import { LanguageModule } from '../language.module';
import { LanguageEntity } from '../entities/language.entity';
import { CreateLanguageDto } from '../dto/create-language.dto';
import { tearDownDatabase, useRefreshDatabase } from 'typeorm-seeding';

dotenv.config();

describe('Languages', () => {
  let app: INestApplication;
  let repository: Repository<LanguageEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        LanguageModule,
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
    repository = module.get(getRepositoryToken(LanguageEntity));

    /** seeding */
    await useRefreshDatabase();

    await app.init();
  });

  it(`/GET languages`, async () => {
    await repository.save([{ name: 'French' }, { name: 'Chinese' }]);

    const { body } = await request
      .agent(app.getHttpServer())
      .get('/language')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);

    expect(body).toEqual([
      {
        name: 'French',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
      {
        name: 'Chinese',
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    ]);
  });

  it(`/GET languages names`, async () => {
    await repository.save([{ name: 'French' }, { name: 'Chinese' }, { name: 'Asl' }]);

    const { body } = await request
      .agent(app.getHttpServer())
      .get('/language/names')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);

    expect(body).toEqual(['French', 'Chinese', 'ASL'].sort());
  });

  it('should create a language', async () => {
    const dto = new CreateLanguageDto();
    dto.name = 'French';

    const { body } = await request
      .agent(app.getHttpServer())
      .post('/language')
      .send(dto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED);

    expect(body).toEqual({
      name: 'French',
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    });
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM language;`);
  });

  afterAll(async () => {
    await tearDownDatabase();
    await app.close();
  });
});
