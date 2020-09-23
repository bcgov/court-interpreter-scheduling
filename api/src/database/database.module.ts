import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
// require('dotenv').config();
// import { join } from 'path';

// const entities =
//   process.env.NODE_ENV === 'development' ||
//   process.env.NODE_ENV === 'production'
//     ? join(__dirname, 'src/**/**.entity{.ts,.js}')
//     : 'dist/**/*.entity{ .ts,.js}';
// const synchronize =
//   process.env.NODE_ENV === 'development' ||
//   process.env.NODE_ENV === 'production'
//     ? false
//     : false;
// console.dir({
//   host: process.env.DB_HOST,
//   username: process.env.POSTGRESQL_USER,
//   password: process.env.POSTGRESQL_PASSWORD,
//   database:
//     process.env.NODE_ENV !== 'test'
//       ? process.env.POSTGRESQL_DATABASE
//       : process.env.DB_TEST_DATABASE,
// });
// const option: any = {
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10) || 5432,
//   username: process.env.POSTGRESQL_USER,
//   password: process.env.POSTGRESQL_PASSWORD,
//   database:
//     process.env.NODE_ENV !== 'test'
//       ? process.env.POSTGRESQL_DATABASE
//       : process.env.DB_TEST_DATABASE,
//   entities: [entities],
//   migrations: ['dist/migrations/*{.ts,.js}'],
//   cli: {
//     migrationsDir: 'src/migrations',
//   },
//   synchronize,
//   migrationsRun: process.env.NODE_ENV === 'production',
//   dropSchema: true,
// };

@Module({
  imports: [TypeOrmModule.forRoot()],
  providers: [DatabaseService],
})
export class DatabaseModule {}
