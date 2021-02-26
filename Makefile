#!make

####################################################################
## Define default environment variables for local development
####################################################################

-include ./api/.env

export $(shell sed 's/=.*//' ./api/.env)
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')
export COMMIT_SHA?=$(shell git rev-parse --short=7 HEAD)
export IMAGE_TAG=${COMMIT_SHA}

export PROJECT := $(or $(PROJECT), court)
export DB_USER := $(or $(DB_USER), court_nestapi)
export DB_PASSWORD := $(or $(DB_PASSWORD), court_nest123)
export DB_NAME := $(or $(DB_NAME), nest_api_dev)
export DB_SERVER := $(or $(DB_SERVER),database)
export DB_PORT := $(or $(DB_PORT),50000)
export GIT_LOCAL_BRANCH := $(or $(GIT_LOCAL_BRANCH),dev)

define deployTag
"${PROJECT}-${DEPLOY_DATE}"
endef

local-api: | print-status build-local run-local-db run-local-api

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
build-local:
	@echo "+\n++ Make: Building locally ...\n+"
	@docker-compose -f docker-compose.yml build


build-local-dev:
	@echo "+\n++ Make: Building locally ...\n+"
	@docker-compose -f docker-compose.dev.yml build

run-local:
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.yml up

run-local-api:
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.yml up api

run-local-db:
	@echo "+\n++ Make: Running db locally ...\n+"
	@docker-compose -f docker-compose.yml up -d postgres 

close-local:
	@echo "+\n++ Make: Closing local container ...\n+"
	@docker-compose -f docker-compose.yml down

local-api-workspace:
	@echo "Make: Shelling into api workspace ..."
	@docker-compose -f docker-compose.yml exec api bash

local-api-log:
	@echo "Make: log api ..."
	@docker-compose -f docker-compose.yml logs -f api

local-db-workspace:
	@echo "Make: Shelling into database workspace ..."
	@docker-compose -f docker-compose.yml exec postgres psql -U $(DB_USER) -W $(DB_DATABASE)

local-db-seed:
	@docker exec -it $(PROJECT)-nest npm run seed:run

local-db-migrate:
	@docker exec -it $(PROJECT)-nest npm run migrate:run

e2e-test:
	@echo "Make: start docker-compose.test"
	@docker-compose -f docker-compose.test.yml build
	@docker-compose -f docker-compose.test.yml up -d postgres keycloak client api
	@bash .docker/wait-for.sh http://keycloak.local.freshworks.club:8080/auth/realms/court/
	@docker-compose -f docker-compose.test.yml up cypress

####################################################################
## Dev Docker Development
####################################################################

run-dev:
	@echo "+\n++ Make: Running dev ...\n+"
	@docker-compose -f docker-compose.dev.yml up

dev-api-workspace:
	@echo "Make: Shelling into dev api workspace ..."
	@docker-compose -f docker-compose.dev.yml exec api bash
