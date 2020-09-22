const { join } = require('path');

const entities =
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
    ? join(__dirname, 'src/**/**.entity{.ts,.js}')
    : 'dist/**/*.entity{ .ts,.js}';
const synchronize =
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
    ? false
    : false;

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV !== 'test'
      ? process.env.DB_DATABASE
      : process.env.DB_TEST_DATABASE,
  entities: [entities],
  migrations: ['dist/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize,
  migrationsRun: process.env.NODE_ENV === 'production',
  dropSchema: true,
};
