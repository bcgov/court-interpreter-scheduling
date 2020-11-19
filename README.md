# Court-scheduler

## Dev

- Running in docker

```bash
$ docker-compose -f docker-compose.dev.yml up -d
```

- Login to keycloak and add user

`http://localhost:8080/auth`

with credential

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

#### End to end testing

The following three commands in order will kick off e2e testing via the docker-compose.test.yml file

`docker-compose -f docker-compose.test.yml build`
`docker-compose -f docker-compose.test.yml up webapp api postgres keycloak`
`docker-compose -f docker-compose.test.yml up cypress --abort-on-container-exit --exit-code-from cypress`

## URL

Dev: https://dev-court-interpreter-scheduling.apps.silver.devops.gov.bc.ca/
