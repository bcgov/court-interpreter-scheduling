# Court Scheduling - Server

This project was bootstrapped with [NestJS](https://docs.nestjs.com/first-steps).

## Commands

In the project directory, you can run:

| Command                  | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| npm run watch            | Sets `APP_OUTPUT` to 'ALL' and runs the app in development mode      |
| npm run start            | Sets `APP_OUTPUT` to 'ALL' and runs the app in production mode       |
| npm run start:traveller  | Sets `APP_OUTPUT` to 'TRAVELLER' and runs the app in production mode |
| npm run start:admin      | Sets `APP_OUTPUT` to 'ADMIN' and runs the app in production mode     |
| npm run build            | Sets `APP_OUTPUT` to 'ALL' and builds the app for production         |
| npm run build:traveller  | Sets `APP_OUTPUT` to 'TRAVELLER' and builds the app for production   |
| npm run build:admin      | Sets `APP_OUTPUT` to 'ADMIN' and builds the app for production       |
| npm run test             | Sets `APP_OUTPUT` to 'ALL' and runs tests                            |
| npm run test:traveller   | Sets `APP_OUTPUT` to 'TRAVELLER' and runs tests                      |
| npm run test:admin       | Sets `APP_OUTPUT` to 'ADMIN' and runs tests                          |
| npm run test:service     | Sets `APP_OUTPUT` to 'SA' and runs tests                             |
| npm run db:seed          | Sets `APP_OUTPUT` to 'ALL' and fills the db with dummy data          |
| npm run db:migrate       | Runs migrations against the db for development mode                  |
| npm run db:migrate-built | Runs migrations against the db for production mode                   |
| npm run lint             | Identifies linting warnings/errors                                   |

### `npm run start*`

These scripts run the app in the production mode.<br />

### `npm run build*`

These scripts build the app for production and place the contents in the `build` folder.<br />

Your app is ready to be served!

### `npm run test*`

These scripts run tests

See the section about [testing](https://docs.nestjs.com/fundamentals/testing) for more information.

### `npm run db*`

These scripts run actions against the database.

## Learn More

You can learn more about [NestJS](https://nestjs.com/)
