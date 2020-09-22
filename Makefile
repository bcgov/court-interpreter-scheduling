#!make

####################################################################
## Define default environment variables for local development
####################################################################

-include .env

export $(shell sed 's/=.*//' .env)
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')
export COMMIT_SHA?=$(shell git rev-parse --short=7 HEAD)
export IMAGE_TAG=${COMMIT_SHA}

export PROJECT := $(or $(PROJECT),abhealth)
export DB_USER := $(or $(DB_USER),db2inst1)
export DB_PASSWORD := $(or $(DB_PASSWORD),development)
export DB_NAME := $(or $(DB_NAME),testdb)
export DB_SERVER := $(or $(DB_SERVER),database)
export DB_PORT := $(or $(DB_PORT),50000)
export GIT_LOCAL_BRANCH := $(or $(GIT_LOCAL_BRANCH),dev)

define deployTag
"${PROJECT}-${DEPLOY_DATE}"
endef

####################################################################
## Status Output
####################################################################

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | GIT LOCAL BRANCH: $(GIT_LOCAL_BRANCH) "
	@echo " | PROJECT: $(PROJECT) "
	@echo " | DB_NAME: $(DB_NAME) "
	@echo " | DB_SERVER: $(DB_SERVER) "
	@echo " | DB_USER: $(DB_USER) "
	@echo " +---------------------------------------------------------+ "

####################################################################
## Local Development
####################################################################

run-local:
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up

run-local-client:
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up client

run-local-server:
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up server

run-local-db:
	@echo "+\n++ Make: Running db locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up database

close-local:
	@echo "+\n++ Make: Closing local container ...\n+"
	@docker-compose -f docker-compose.dev.yml down

local-client-workspace:
	@docker exec -it $(PROJECT)-client sh

local-server-workspace:
	@docker exec -it $(PROJECT)-server bash

local-db-workspace:
	@docker exec -it $(PROJECT)-database bash

local-db-seed:
	@docker exec -it $(PROJECT)-server npm run db:seed

local-db-migrate:
	@docker exec -it $(PROJECT)-server npm run db:migrate