# Court-scheduler

## Dev

- Running in docker

```bash
$ docker-compose -f docker-compose.dev.yml up -d
```

NB: the frontend and api need to be run outside of Docker to take advantage of watch-mode for development

- Login to keycloak to add yourself a new user:

`http://localhost:8080/auth`

use the following credentials to access the keycloak admin panel:

```
username: admin
password: password
```

![keycloak](https://i.imgur.com/9COED9p.png)

add user

![add user](https://i.imgur.com/ZiKLZXO.png)

#### Database Seeding

To generate dummy data: `docker exec -d court-nest npm run seed:run`

To populate with JSON data

1. Login to app via a web browser
2. Retrieve the JWT token from network tab
3. Use Postman to POST a JSON array of interpreters to `http://localhost:4000/api/v1/interpreter/upload` using the JWT token as the Authorization header: `Bearer <token>`

The JSON file in `e2e/cypress/fixtures/interpreters` can be used as per the above to seed the database.

NB: the following section will produce an application stack with 3 interpreters that can be used to test the application manually in prod mode at `http://localhost:5000`

#### End to end testing

The following three commands in order will kick off e2e testing via the `docker-compose.test.yml` file, alternatively simply run `make e2e-test`:

`docker-compose -f docker-compose.test.yml build`

`docker-compose -f docker-compose.test.yml up -d client api postgres keycloak`

`docker-compose -f docker-compose.test.yml up cypress --abort-on-container-exit --exit-code-from cypress`

## URL

Dev: https://dev-court-interpreter-scheduling.apps.silver.devops.gov.bc.ca/

Test: https://test-court-interpreter-scheduling.apps.silver.devops.gov.bc.ca/
