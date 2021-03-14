import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const entities =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? join(__dirname, '../**/**.entity{.ts,.js}')
    : 'dist/**/*.entity{ .ts,.js}';

const synchronize =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? true
    : false;

const option: any = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  database:
    process.env.NODE_ENV !== 'test'
      ? process.env.POSTGRESQL_DATABASE
      : process.env.DB_TEST_DATABASE,
  entities: [entities],
  migrations: ['dist/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize,
  migrationsRun: process.env.NODE_ENV === 'production',
  dropSchema: false,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  keepConnectionAlive: true,
  logging: ['query'],
};

@Module({
  imports: [TypeOrmModule.forRoot(option)],
  providers: [DatabaseService],
})
export class DatabaseModule {}
