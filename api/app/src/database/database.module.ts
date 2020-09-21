import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database:
        process.env.NODE_ENV !== 'test'
          ? process.env.DB_DATABASE
          : process.env.DB_TEST_DATABASE,
      entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
      migrations: [join(__dirname, './migrations/**{.ts,.js}')],
      cli: {
        migrationsDir: './migrations',
      },
      synchronize: true,
      migrationsRun: process.env.NODE_ENV === 'production',
      dropSchema: true,
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
