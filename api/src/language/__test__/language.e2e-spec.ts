import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LanguageModule } from '../language.module';
import { LanguageEntity } from '../entities/language.entity';
import { CreateLanguageDto } from '../dto/create-language.dto';

describe('Languages', () => {
  let app: INestApplication;
  let repository: Repository<LanguageEntity>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        LanguageModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5435,
          username: 'court_nestapi',
          password: 'court_nest123',
          database: 'nest_api_test',
          entities: ['./**/*.entity.ts'],
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    repository = module.get(getRepositoryToken(LanguageEntity));
    await app.init();
  });

  it(`/GET languages`, async () => {
    await repository.save([{ name: 'French' }, { name: 'Chinese' }]);

    const { body } = await request
      .agent(app.getHttpServer())
      .get('/language')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

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

  it('should create a language', async () => {
    const dto = new CreateLanguageDto();
    dto.name = 'French';

    const { body } = await request
      .agent(app.getHttpServer())
      .post('/language')
      .send(dto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

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
    await app.close();
  });
});
