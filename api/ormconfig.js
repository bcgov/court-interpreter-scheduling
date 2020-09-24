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
console.dir({
  host: process.env.DB_HOST,
  username: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  database:
    process.env.NODE_ENV !== 'test'
      ? process.env.POSTGRESQL_DATABASE
      : process.env.DB_TEST_DATABASE,
});
module.exports = {
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
  dropSchema: true,
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  keepConnectionAlive: true,
};
