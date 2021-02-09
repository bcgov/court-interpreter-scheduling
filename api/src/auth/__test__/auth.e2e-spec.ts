import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';

import { AppModule } from 'src/app.module';

dotenv.config();

describe('keycloak', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
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

    await app.init();
  });

  describe('connect to keycloak', () => {
    it('will get 401 if did not get token from keycloak', async () => {
      await request
        .agent(app.getHttpServer())
        .get('/keycloak')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    describe('get token with grant_type: client_credentials', () => {
      it('will get 200 if get token from keycloak', async () => {
        const tokenRequest = request(
          `${process.env.KEYCLOAK_AUTH_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        );
        const { body: tokenBody } = await tokenRequest
          .post('/')
          .send({
            client_id: process.env.KEYCLOAK_CLIENT,
            grant_type: 'client_credentials',
            client_secret: process.env.KEYCLOAK_SECRET,
          })
          .set('Content-Type', 'application/x-www-form-urlencoded');

        const { access_token: token } = tokenBody;

        // TODO test is skipped because this bit is failing with an NPE from keycloak. No idea why.
        const resp = await request
          .agent(app.getHttpServer())
          .get('/keycloak')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /html/)
          .expect(HttpStatus.OK);

        expect(resp.text).toBe('key cloak success');
      });
    });

    describe('get token with grant_type: password', () => {
      it('will get 200 if get token from keycloak', async () => {
        const tokenRequest = request(
          `${process.env.KEYCLOAK_AUTH_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        );
        const { body: tokenBody } = await tokenRequest
          .post('/')
          .send({
            client_id: process.env.KEYCLOAK_FE_CLIENT,
            grant_type: 'password',
            username: 'cypress-admin',
            password: 'adminOfTheCourt',
          })
          .set('Content-Type', 'application/x-www-form-urlencoded');

        const { access_token: token } = tokenBody;

        const { text } = await request
          .agent(app.getHttpServer())
          .get('/keycloak')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect('Content-Type', /html/)
          .expect(HttpStatus.OK);

        expect(text).toBe('key cloak success');
      });
    });
  });

  afterEach(async () => {});

  afterAll(async () => {
    await app.close();
  });
});
