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

## Upload CSV

1. save excel file to csv

2. postman: `POST /interpreter/csv`

Body:

- `file`: select the csv file
- `isEmptyTable` (boolean): Empty the `interpreter` table
- `isAnonymous` (boolean): Anonymize the interpreter
- `isVisual` (boolean): When uploading the `visual` interpreters, please use value: `true`

3. For Regular Interpreters:

- `file`
- `isEmptyTable`: true
- `isAnonymous`: true, if env = 'test', 'dev'

4. For Visual Interpreters:

- `file`
- `isAnonymous`: true, if env = 'test', 'dev'

## Add GUID to scope

- Add `Client Scope`
  ![image](https://user-images.githubusercontent.com/31360789/117179536-125a5700-ad88-11eb-861c-59260a7a9b90.png)

- Create `Mapper`
  ![image](https://user-images.githubusercontent.com/31360789/117179714-433a8c00-ad88-11eb-8d20-ca11e3cbfbdb.png)

  ![image](https://user-images.githubusercontent.com/31360789/117179843-6b29ef80-ad88-11eb-8509-d1670669787a.png)

- go to `Clients`, add `client scope` to our clients: `court-fe` and `court-client`
  ![image](https://user-images.githubusercontent.com/31360789/117180137-b6440280-ad88-11eb-935b-1db160c2d419.png)

- Then you can test:
  ![image](https://user-images.githubusercontent.com/31360789/117181778-741bc080-ad8a-11eb-8a67-c4b1eb2d1166.png)

  ![image](https://user-images.githubusercontent.com/31360789/117182066-be9d3d00-ad8a-11eb-88c4-f96b7acb4321.png)

### Test GUID Scope locally

- Add new `user`

- Add `User Attribute`
  ![image](https://user-images.githubusercontent.com/31360789/117189662-4d15bc80-ad93-11eb-8592-efb5d8d80d2f.png)
