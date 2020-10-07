#!make

.DEFAULT_GOAL := default

export NAMESPACE := $(or $(NAMESPACE), $$NS)
export APP_NAME := $(or $(APP_NAME), court-interpreter-scheduler)
export BUILD_ID := $(or $(BUILD_ID), $$ID)
export APP_KEY :=  $(or $(APP_KEY), $$KEY)
export TEMPLATE_FILE_NAME := $(or $(TEMPLATE_FILE_NAME), $$FILE)
export BRANCH := $(or $(BRANCH), $$BR)
export BUILD_NAMESPACE := $(or $(BUILD_NAMESPACE), $$BUILD_NS)
export DOMAIN := $(or $(DOMAIN), pathfinder.gov.bc.ca)
export HOST_PREFIX := $(or $(HOST_PREFIX), $$HPX)

default:
	@echo "Please see README.md for usage of make commands"

# ------------------------------------------------------------------------------
# Task Aliases
# ------------------------------------------------------------------------------

oc-build: app-check print-status build
oc-api: app-check print-status deploy-api
oc-db: app-check print-status deploy-db
oc-delete: app-check print-status delete
DIR := ${CURDIR}

## Define build and deploy variable
define NAME
"$(APP_KEY)-$(APP_NAME)"
endef

define DB_SERVICE_NAME
"db-$(APP_NAME)"
endef

define DB_SERVICE_INSTANCE
"db-$(APP_NAME)-$(BUILD_ID)"
endef

define INSTANCE
"${APP_KEY}-$(APP_NAME)-$(BUILD_ID)"
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

define API_HOST
"api-$(HOST_PREFIX)-$(APP_NAME).$(DOMAIN)"
endef

define APP_HOST
"$(HOST_PREFIX)-$(APP_NAME).$(DOMAIN)"
endef

define API_BUILD_TEMPLATE_PATH
"./openshift/api.bc.yml"
endef

define API_DEPLOY_TEMPLATE_PATH
"./openshift/api.dc.yml"
endef

define DB_DEPLOY_TEMPLATE_PATH
"./openshift/db.dc.yml"
endef


# Openshift Build
app-check:
	test -n "$(NAMESPACE)"
	test -n "$(APP_NAME)"
	test -n "$(BUILD_ID)"
	test -n "$(TEMPLATE_FILE_NAME)"

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | PROJECT:      $(APP_NAME)"
	@echo " | BRANCH:       $(BRANCH)"
	@echo " | NAMESPACE:    $(NAMESPACE)"
	@echo " | NAMESPACE:    $(BUILD_NAMESPACE)"
	@echo " +---------------------------------------------------------+ "
	@echo " | BUILD_ID: 	$(BUILD_ID) "
	@echo " | BUILD_TAG: 	$(BUILD_TAG) "
	@echo " +---------------------------------------------------------+ "
	@echo " | FILE NAME: 	$(TEMPLATE_FILE_NAME) "
	@echo " | FILE PATH: 	$(TEMPLATE_PATH) "
	@echo " +---------------------------------------------------------+ "

build:
	test -n "$(BRANCH)"
	test -n "$(APP_KEY)"
	@echo "+\n++ BUILIDING $(APP_KEY) with tag: $(BUILD_TAG)\n+"
	@oc process -f $(TEMPLATE_PATH) -p SOURCE_REPOSITORY_REF=$(BRANCH) NAME=$(NAME) INSTANCE=$(INSTANCE) TAG=$(BUILD_TAG) PROJECT=$(APP_NAME) | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(NAME) --wait

build-api:
	test -n "$(BRANCH)"
	@echo "+\n++ BUILIDING API with tag: $(BUILD_TAG)\n+"
	@oc process -f $(API_BUILD_TEMPLATE_PATH) -p SOURCE_REPOSITORY_REF=$(BRANCH) NAME=$(NAME) INSTANCE=$(INSTANCE) TAG=$(BUILD_TAG) PROJECT=$(APP_NAME) | oc -n $(BUILD_NAMESPACE) apply -f -
	@oc -n $(BUILD_NAMESPACE) start-build bc/$(NAME) --wait

import:
	test -n "$(NAMESPACE)"
	test -n "$(BUILD_NAMESPACE)"
	test -n "$(BRANCH)"
	test -n "$(APP_KEY)"
	@echo "+\n++ Importing image from $(BUILD_NAMESPACE):$(NAME)/$(BUILD_TAG) to $(NAMESPACE):$(NAME)$/(BUILD_TAG) \n+"
	@oc tag $(BUILD_NAMESPACE)/$(NAME):$(TAG) $(NAMESPACE)/$(NAME):$(TAG)

deploy-db:
	@echo "+\n++ Deploying DB with tag: $(BUILD_ID)\n+"
	@oc process -f $(DB_DEPLOY_TEMPLATE_PATH) -p NAME=$(DB_SERVICE_NAME) INSTANCE=$(DB_SERVICE_INSTANCE) PROJECT=$(APP_NAME) | oc -n $(NAMESPACE) apply -f - 
	@oc -n $(NAMESPACE) rollout status dc/$(DB_SERVICE_NAME)


deploy-api:
	@echo "+\n++ Deploying API with tag: $(BUILD_TAG)\n+"
	@oc process -f $(API_DEPLOY_TEMPLATE_PATH) -p NAME=$(API) TAG=$(BUILD_TAG) INSTANCE=$(API_INSTANCE) BUILD_ID=$(BUILD_ID) DB_SERVICE=$(DB_SERVICE_NAME) HOST=$(API_HOST) PROJECT=$(APP_NAME) | oc -n $(NAMESPACE) apply -f - --dry-run
	@oc -n $(NAMESPACE) rollout status dc/$(API)

delete:
	@echo "+\n++ Deleting deployment $$APPLICATION from namespace $(NAMESPACE)\n+"
	@oc project $(BUILD_NAMESPACE)
	@oc delete all -l app=$$APPLICATION
	@oc project $(NAMESPACE)
	@oc delete all -l app=$$APPLICATION

delete-project:
	@echo "+\n++ Delete all project related items\n"
	@oc project $(BUILD_NAMESPACE)
	@oc delete all -l project=$(APP_NAME)
	@oc project $(NAMESPACE)
	@oc delete all -l project=$(APP_NAME)





	
