# Pipeline

This application can manage openshift deployment and build.

## List of applications

1. DB (db): Postgres Database container

2. Web API (api): Restful node js web api container

3. Web App (app/web): Node based react app distribution container  

## List of env

1. tools: For building images and hosting dev tools.

2. dev: Env to host dev deployments

3. test: Env to host test deployments

4. prod: Env to host production deployment

## Build Application

Following commands will build application image in openshift remote cluster

Cmd > **npm run oc-build -- app=#App-name> --id=#BuildId --branch=#GitBranchToBuild**

## Deploy Application

Following command will deploy application on openshift

Cmd (for db only) > **npm run oc-deploy -- --app=db --id=#BuildId --env=#Remote-env**
Cmd > **npm run oc-deploy -- app=#App-name> --id=#BuildId --branch=#GitBranchToDeploy --env=Remote-env**

## Note

To add module alias

1. Install module alias.

2. Add require('module-alias/register') in bootstrap source file here app.ts

3. Create __moduleAliases entries in package.json file
