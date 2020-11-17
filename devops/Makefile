#!make

-include .env
export $(shell sed 's/=.*//' .env)

.DEFAULT_GOAL := default

export NAMESPACE := $(or $(NAMESPACE), $$NS)
export APP_NAME := $(or $(APP_NAME), court-interpreter-scheduling)
export BUILD_ID := $(or $(BUILD_ID), 1)
export APP_KEY :=  $(or $(APP_KEY), $$KEY)
export TEMPLATE_FILE_NAME := $(or $(TEMPLATE_FILE_NAME), $$FILE)
export BRANCH := $(or $(BRANCH), dev)
export BUILD_NAMESPACE := $(or $(BUILD_NAMESPACE), $$BUILD_NS)
export DOMAIN := $(or $(DOMAIN), apps.silver.devops.gov.bc.ca)
export DB_NAME := $(or $(DB_NAME), court-interpreter-scheduling)
export KC_AUTH_URL := $(or $(KC_AUTH_URL), https://oidc.gov.bc.ca/auth/)
export KC_REALM := $(or $(KC_REALM), joxo7v8f)

default:
	@echo "Please see README.md for usage of make commands"

# ------------------------------------------------------------------------------
# Task Aliases
# ------------------------------------------------------------------------------

oc-build: app-check print-status build
oc-build-api: app-check print-status build-api
oc-build-app: app-check print-status build-app
oc-deploy-db: app-check print-status deploy-db
oc-deploy-api: app-check print-status deploy-api
oc-deploy-app: app-check print-status deploy-app
oc-delete: app-check print-status delete
DIR := ${CURDIR}

## Define build and deploy variable
define NAME
"$(APP_NAME)"
endef

define DB_SERVICE_NAME
"patroni-master"
endef

define TEMPLATE_PATH 
"./openshift/$(TEMPLATE_FILE_NAME)"
endef

define BUILD_TAG
"$(BRANCH)-${BUILD_ID}"
endef

define API
"api-$(APP_NAME)"
endef

define API_INSTANCE
"api-$(APP_NAME)-$(BUILD_ID)"
endef

define APP
"app-$(APP_NAME)"
endef

define APP_INSTANCE
"app-$(APP_NAME)-$(BUILD_ID)"
endef

define APP_HOST
"$(HOST_PREFIX)$(APP_NAME).$(DOMAIN)"
endef

define API_DEPLOY_TEMPLATE_PATH
"./openshift/api-deploy.yml"
endef

define DB_DEPLOY_TEMPLATE_PATH
"./openshift/patroni-deploy.yml"
endef

define APP_DEPLOY_TEMPLATE_PATH
"./openshift/app-deploy.yml"
endef

define DOCKER_BUILD_TEMPLATE_PATH
"./openshift/docker-build.yml"
endef

define KEYCLOAK_IMAGE_NAME
"courts-keycloak"
endef

define KC_NGINX_IMAGE_NAME
"$(KEYCLOAK_IMAGE_NAME)-nginx"
endef


define rollout_and_wait
@oc -n $(NAMESPACE) rollout status $1
endef

define DB_BACKUP_APP
"db-backup"
endef

# Openshift Build
app-check:
	test -n "$(BUILD_ID)"

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | PROJECT:      $(APP_NAME)"
	@echo " | BRANCH:       $(BRANCH)"
	@echo " | NAMESPACE:    $(NAMESPACE)"
	@echo " | BUILD_NAMESPACE:    $(BUILD_NAMESPACE)"
	@echo " +---------------------------------------------------------+ "
	@echo " | BUILD_ID: 	$(BUILD_ID) "
	@echo " | BUILD_TAG: 	$(BUILD_TAG) "
	@echo " +---------------------------------------------------------+ "
	@echo " | FILE NAME: 	$(TEMPLATE_FILE_NAME) "
	@echo " | FILE PATH: 	$(TEMPLATE_PATH) "
	@echo " +---------------------------------------------------------+ "
	@echo " | HOST NAME: 	$(APP_HOST) "
	@echo " +---------------------------------------------------------+ "

init-project:
	@echo "Run initial set-up for the project, including network security\n" 
	@oc process -f openshift/security-init.yml -p NAMESPACE=$$(oc project --short) | oc apply -f -
	@oc -n $(BUILD_NAMESPACE) policy add-role-to-group system:image-puller system:serviceaccounts:$$(oc project --short)

init-keycloak:
	@oc process -f openshift/keycloak-pre-req.yml | oc apply -f -
	@oc process -f openshift/createdb-job.yml -p DB_NAME=keycloak -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) | oc apply -f -

init-patroni:
	@oc process -f openshift/patroni-pre-req.yml | oc apply -f -

build:
	test -n "$(BRANCH)"
	test -n "$(APP_KEY)"
	@echo "+\n++ BUILDING $(APP_KEY) with tag: $(BUILD_TAG)\n+"
	@oc -n $(BUILD_NAMESPACE) process -f $(TEMPLATE_PATH) -p SOURCE_REPOSITORY_REF=$(BRANCH) NAME=$(NAME) INSTANCE=$(API_INSTANCE) TAG=$(BUILD_TAG) PROJECT=$(APP_NAME) | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(NAME) --wait

build-api:
	test -n "$(BRANCH)"
	test -n "$(BUILD_NAMESPACE)"
	@echo "+\n++ BUILDING API with tag: $(BUILD_TAG)\n+"
	@oc -n $(BUILD_NAMESPACE) process -f $(DOCKER_BUILD_TEMPLATE_PATH) -p TAG=$(BUILD_TAG) -p SOURCE_REPOSITORY_REF=$(BRANCH) -p BASE_IMAGE_NAME="nodejs-12" -p BASE_IMAGE_TAG="1" -p BASE_IMAGE_REPO="registry.access.redhat.com/ubi8/" -p SOURCE_CONTEXT_DIR=api -p NAME=$(API) | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(API) --wait

build-app:
	test -n "$(BRANCH)"
	test -n "$(BUILD_NAMESPACE)"
	@echo "+\n++ BUILIDING APP with tag: $(BUILD_TAG)\n+"
	@oc -n $(BUILD_NAMESPACE) process -f $(DOCKER_BUILD_TEMPLATE_PATH) -p ARG_KEY_1=REACT_APP_REALM_AUTH_URL -p ARG_VAL_1=$(KC_AUTH_URL) -p ARG_KEY_2=KC_REALM -p ARG_VAL_2=$(KC_REALM) -p TAG=$(BUILD_TAG) -p SOURCE_REPOSITORY_REF=$(BRANCH) -p BASE_IMAGE_NAME="nodejs-12" -p BASE_IMAGE_TAG="1" -p BASE_IMAGE_REPO="registry.access.redhat.com/ubi8/" -p SOURCE_CONTEXT_DIR=frontend -p NAME=$(APP) | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(APP) --wait

build-patroni:
	@oc -n $(BUILD_NAMESPACE) process -f $(DOCKER_BUILD_TEMPLATE_PATH) -p NAME=patroni -p TAG="12-latest" -p BASE_IMAGE_NAME=postgres -p BASE_IMAGE_TAG="12" -p SOURCE_REPOSITORY_URL="https://github.com/BCDevOps/platform-services.git" -p SOURCE_REPOSITORY_REF="master" -p SOURCE_CONTEXT_DIR="apps/pgsql/patroni/docker" | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/patroni --wait

build-keycloak-nginx: 
	@oc -n $(BUILD_NAMESPACE) process -f $(DOCKER_BUILD_TEMPLATE_PATH) -p BASE_IMAGE_NAME=nginx -p BASE_IMAGE_TAG="1.19.3" -p SOURCE_REPOSITORY_REF=$(BRANCH) -p SOURCE_CONTEXT_DIR=".docker/keycloak-nginx" -p NAME=$(KC_NGINX_IMAGE_NAME) | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(KC_NGINX_IMAGE_NAME) --wait

build-keycloak:
	@oc -n $(BUILD_NAMESPACE) process -f $(DOCKER_BUILD_TEMPLATE_PATH) -p BASE_IMAGE_NAME=keycloak -p BASE_IMAGE_TAG="11.0.2" -p SOURCE_REPOSITORY_REF=$(BRANCH) -p BASE_IMAGE_REPO="jboss/" -p SOURCE_CONTEXT_DIR=".docker/keycloak" -p NAME=$(KEYCLOAK_IMAGE_NAME) | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(KEYCLOAK_IMAGE_NAME) --wait

build-db-backup:
	@oc -n $(BUILD_NAMESPACE) process -f $(DOCKER_BUILD_TEMPLATE_PATH) -p NAME=$(DB_BACKUP_APP) -p TAG="12-latest" -p BASE_IMAGE_NAME="postgresql-12-rhel7" -p BASE_IMAGE_TAG="latest" -p BASE_IMAGE_REPO="registry.redhat.io/rhscl/" -p SOURCE_REPOSITORY_URL="https://github.com/BCDevOps/backup-container.git" -p SOURCE_REPOSITORY_REF="master" -p SOURCE_CONTEXT_DIR="docker" | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(DB_BACKUP_APP) --wait

import:
	test -n "$(NAMESPACE)"
	test -n "$(BUILD_NAMESPACE)"
	test -n "$(BRANCH)"
	test -n "$(APP_KEY)"
	@echo "+\n++ Importing image from $(BUILD_NAMESPACE):$(NAME)/$(BUILD_TAG) to $(NAMESPACE):$(NAME)$/(BUILD_TAG) \n+"
	@oc tag $(BUILD_NAMESPACE)/$(NAME):$(TAG) $(NAMESPACE)/$(NAME):$(TAG)

deploy-api:
	test -n "$(NAMESPACE)"
	test -n "$(BUILD_NAMESPACE)"
	test -n "$(BRANCH)"
	@echo "+\n++ Deploying API with tag: $(BUILD_TAG)\n+"
	@oc -n $(NAMESPACE) process -f openshift/api-deploy.yml -p NAME=$(API) -p HOST_NAME=$(APP_HOST) -p DB_SERVICE=$(DB_SERVICE_NAME) -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) -p IMAGE_STREAM_TAG="$(API):$(BUILD_TAG)" -p KEYCLOAK_URL=$(KC_AUTH_URL)  -p DB_NAME=$(DB_NAME)| oc -n $(NAMESPACE) apply -f -
	$(call rollout_and_wait,dc/$(API))

deploy-app:
	test -n "$(NAMESPACE)"
	test -n "$(BUILD_NAMESPACE)"
	test -n "$(BRANCH)"
	@echo "+\n++ Deploying APP with tag: $(BUILD_TAG)\n+"
	@oc -n $(NAMESPACE) process -f openshift/app-deploy.yml -p NAME=$(APP) -p HOST_NAME=$(APP_HOST) -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) -p IMAGE_STREAM_TAG="$(APP):$(BUILD_TAG)" | oc -n $(NAMESPACE) apply -f -
	$(call rollout_and_wait,dc/$(APP))

deploy-keycloak:
	@oc process -f openshift/keycloak-deploy.yml -p HOST_NAME=$(APP_HOST) -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) -p IMAGE_STREAM_TAG=$(KEYCLOAK_IMAGE_NAME):latest | oc apply -f -
	$(call rollout_and_wait,dc/keycloak)

deploy-keycloak-nginx:
	@oc process -f openshift/keycloak-nginx-deploy.yml -p HOST_NAME=$(APP_HOST) -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) -p IMAGE_STREAM_TAG=$(KC_NGINX_IMAGE_NAME):latest | oc apply -f -
	$(call rollout_and_wait,dc/keycloak-nginx)

deploy-patroni:
	@oc process -f openshift/patroni-deploy.yml -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) -p IMAGE_STREAM_TAG=patroni:12-latest | oc apply -f -

deploy-db-backup:
	@oc -n $(NAMESPACE) process -f openshift/db-backup-deploy.yml -p NAME=$(DB_BACKUP_APP) -p IMAGE_STREAM_TAG=$(DB_BACKUP_APP):12-latest -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) -p BUILD_ID=$(BUILD_ID) -p DB_NAME=$(DB_NAME)  | oc -n $(NAMESPACE) apply -f -
	$(call rollout_and_wait,dc/$(DB_BACKUP_APP))

delete:
	@echo "+\n++ Deleting deployment $$APPLICATION from namespace $(NAMESPACE)\n+"
	@oc project $(NAMESPACE)
	@oc delete all -l app=$$APPLICATION
	@oc delete pvc $$APPLICATION --ignore-not-found

delete-project:
	@echo "+\n++ Delete all project related items\n"
	@oc project $(NAMESPACE)
	@oc delete all -l project=$(APP_NAME)

createdb:
	test -n $(DB_NAME)
	@echo "+\n++ Creating DB ($(DB_NAME)) in $(NAMESPACE) patroni db cluster"
	@oc -n $(NAMESPACE) process -f openshift/createdb-job.yml -p DB_NAME=$(DB_NAME) -p BUILD_NAMESPACE=$(BUILD_NAMESPACE) | oc -n $(NAMESPACE) apply -f -