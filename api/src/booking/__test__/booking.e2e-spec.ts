import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { factory, runSeeder, tearDownDatabase, useRefreshDatabase, useSeeding } from 'typeorm-seeding';
import { LoggerModule } from 'nestjs-pino';

import CreateLanguage from 'src/database/seeds/1-create-language.seed';
import CreateInterpreter from 'src/database/seeds/2-create-interpreter.seed';
import { BookingEntity } from '../entities/booking.entity';
import { BookingModule } from '../booking.module';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingPeriod } from '../enums/booking-period.enum';
import CreateBooking from 'src/database/seeds/3-create-booking.seed';
import { PaginateBookingQueryDto } from '../dto/paginate-booking-query.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

dotenv.config();

describe('booking', () => {
  let app: INestApplication;
  let bookingRepository: Repository<BookingEntity>;
  const API_PATH = '/booking';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BookingModule,
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
    bookingRepository = module.get(getRepositoryToken(BookingEntity));

    /** seeding */
    await useRefreshDatabase();
    await useSeeding();
    await runSeeder(CreateLanguage);
    await runSeeder(CreateInterpreter);

    await app.init();
  });

  describe('search booking', () => {
    beforeAll(async () => {
      await useSeeding();
      await runSeeder(CreateBooking);
    });

    describe('search by dto', () => {
      it('should booking with dto', async () => {
        const booking = await bookingRepository.findOne({
          where: { id: 1 },
          relations: ['interpreter'],
        });

        const dto = new PaginateBookingQueryDto();
        dto.interpreter = booking.interpreter.firstName;
        dto.file = booking.file;

        const { body } = await request
          .agent(app.getHttpServer())
          .post(`${API_PATH}/search`)
          .send(dto)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HttpStatus.OK);

        expect(body.data).toBeDefined();
        expect(body.data.length).toBe(1);
        expect(body.data[0].file).toBe(dto.file);
      });
    });
  });

  describe('create a booking', () => {
    it('can creates a interpreter', async () => {
      const createBookingDto: CreateBookingDto = {
        interpreterId: 1,
        dates: [
          {
            date: new Date(),
            period: BookingPeriod.MORNING,
            arrivalTime: '12:00',
          },
        ],
      };

      const { body } = await request
        .agent(app.getHttpServer())
        .post(API_PATH)
        .send(createBookingDto)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(HttpStatus.CREATED);

      expect(body).toBeDefined();
      expect(body.id).toEqual(expect.any(Number));
      expect(body.interpreter).toBeDefined();
      expect(body.interpreter.id).toBe(createBookingDto.interpreterId);
      expect(body.dates).toEqual(
        createBookingDto.dates.map(d => ({
          ...d,
          id: expect.any(Number),
          date: d.date.toISOString(),
        })),
      );
    });
  });

  describe('remove an booking', () => {
    it('can delete booking by id', async () => {
      /**
       * create booking and check if exists
       */
      const createBooking = await factory(BookingEntity)().create();
      let booking = await bookingRepository.findOne(createBooking.id);
      expect(createBooking).toBeDefined();
      expect(createBooking.id).toBe(booking.id);

      /**
       * delete booking
       */
      const { status } = await request(app.getHttpServer()).delete(
        `${API_PATH}/:id`.replace(':id', createBooking.id.toString()),
      );
      expect(status).toBe(HttpStatus.OK);

      booking = await bookingRepository.findOne(createBooking.id);
      expect(booking).toBeUndefined();
    });
  });

  describe('update a booking', () => {
    it('can update an interpreter by id', async () => {
      /**
       * create booking and check if exists
       */
      const createBooking = await factory(BookingEntity)().create();
      let booking = await bookingRepository.findOne(createBooking.id);
      expect(booking).toBeDefined();
      expect(createBooking.id).toBe(booking.id);

      /**
       * update booking
       */
      const updateBookingDto: UpdateBookingDto = {
        file: 'test file',
      };
      const { status } = await request(app.getHttpServer())
        .patch(`${API_PATH}/:id`.replace(':id', createBooking.id.toString()))
        .send(updateBookingDto);
      expect(status).toBe(HttpStatus.OK);

      booking = await bookingRepository.findOne(createBooking.id);
      expect(booking).toBeDefined();
      expect(booking.file).toBe(updateBookingDto.file);
    });
  });

  afterEach(async () => {
    await bookingRepository.query(`DELETE FROM booking;`);
  });

  afterAll(async () => {
    await tearDownDatabase();
    await app.close();
  });
});
