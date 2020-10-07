# Court Scheduling - Server

This project was bootstrapped with [NestJS](https://docs.nestjs.com/first-steps).

![](https://i.imgur.com/PUVE1kA.png)

<h3 align="center">Court Scheduling Backend</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]() [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Deployment](#deployment)
- [Built Using](#built_using)

## 🧐 About <a name = "about"></a>

Backend for Court Scheduling

## 🏁 Getting Started <a name = "getting_started"></a>

### Installing

There are 2 options, run in `local` or `docker`.

#### Run in Local

In root folder:

- Start Database in docker first

```
docker-compose up postgres
```

- Application

```
$ cp api/.config/.env.example api
$ cd api
$ npm i // first time
$ npm run start:dev
```

#### Run in Docker

```
docker-compose up
```

### Seeding

We use [typeorm-seeding](https://github.com/w3tecch/typeorm-seeding)

You can run seeding to get some testing data for development.

So far we seed the following data:

- `language`
- `interpreter`

```
$ npm run seed:run
```

`Seeding` files are located at `src/database/seeds`.

#### Issues

- https://github.com/w3tecch/typeorm-seeding/issues/29

- https://www.npmjs.com/package/tsconfig-paths

### Migration

- create migration file

```
$ npm run migrate:create <Migration File Name>
```

- running migration

1. Testing in local env,
   Set `syncronize: false, dropSchema: true` in `database.module.ts`.
   Then

```
$ npm run migrate:run
```

2. In Production env, will run migration automatically as we did set `migrationRun: process.env.NODE_ENV='prodcution'`

### Swagger

![](https://i.imgur.com/kr8Xuk9.png)

### SchemaSpy

![](https://i.imgur.com/yAFthhm.png)

### typedoc

![](https://i.imgur.com/iR7tzqo.png)

## 🔧 Running the tests <a name = "tests"></a>

Explain how to run the automated tests for this system.

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## 🎈 Usage <a name="usage"></a>

### Commands

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

## 🚀 Deployment <a name = "deployment"></a>

Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>

- [Postgres](https://www.postgresql.org/) - Database
- [NestJs](https://nestjs.com/) - Server Environment
- [Schemaspy](http://schemaspy.org/) - Display Schema of database
- [Typeorm](https://typeorm.io/#/) - Database ORM

## Testing

### Issues

- https://github.com/typeorm/typeorm/issues/3017

- https://github.com/nestjs/typeorm/issues/61

## Learn More

You can learn more about [NestJS](https://nestjs.com/)
