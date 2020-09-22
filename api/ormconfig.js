const { join } = require('path');

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
  entities: [join(__dirname, '../**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/**{.ts,.js}')],
  cli: {
    migrationsDir: './migrations',
  },
  synchronize: false,
  migrationsRun: process.env.NODE_ENV === 'production',
  dropSchema: true,
};
