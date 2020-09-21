#!make

include .env
-include app/.env

export $(shell sed 's/=.*//' .env)
ifneq ("$(wildcard app/.env)","")
  	export $(shell sed 's/=.*//' app/.env)
endif

export GIT_LOCAL_BRANCH_NAME?=$(shell git rev-parse --abbrev-ref HEAD)
export GIT_LOCAL_BRANCH?=$(subst /,-,$(GIT_LOCAL_BRANCH_NAME))
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')

define deployTag
"${PROJECT}-${DEPLOY_DATE}"
endef

# local-development          - Build and run the development image locally
# local-production           - Build and run the production image locally
# pipeline-deploy            - Pushes production image to ECR, generate Dockerrun.aws.json, then deploys to Elasticbeanstalk
# pipeline-audit             - Installs node modules and runs the security scan
# pipeline-document          - generates documentation and uploads to S3

local-development:          | setup-development-env build-local-development run-local-development
local-staging:              | setup-staging-env build-local-development run-local-development
local-production:           | setup-production-env build-local-production run-local-production
pipeline-deploy:            | pipeline-build pipeline-push pipeline-deploy-prep pipeline-deploy-version pipeline-upload-documentation
pipeline-audit:             | pipeline-build-audit pipeline-report-audit
pipeline-document:          | pipeline-upload-documentation

#################
# Status Output #
#################

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | ACCOUNT ID: $(ACCOUNT_ID) "
	@echo " | PROJECT: $(PROJECT) "
	@echo " | REGION: $(REGION) "
	@echo " | PROFILE: $(PROFILE) "
	@echo " | BUCKET NAME: $(BUCKET_NAME) "
	@echo " | DEPLOY ENV: $(DEPLOY_ENV) "
	@echo " | MERGE BRANCH: $(MERGE_BRANCH) - $(GIT_LOCAL_BRANCH)"
	@echo " +---------------------------------------------------------+ "

####################
# Utility commands #
####################

setup-development-env:
	@echo "+\n++ Make: Preparing project for dev environment...\n+"
	@cp .config/.env.dev app/.env

setup-staging-env:
	@echo "+\n++ Make: Preparing project for staging environment ...\n+"
	@cp .config/.env.staging app/.env

setup-production-env:
	@echo "+\n++ Make: Preparing project for production environment ...\n+"
	@cp .config/.env.production app/.env

# Set an AWS profile for pipeline
setup-aws-profile:
	@echo "+\n++ Make: Setting AWS Profile...\n+"
	@aws configure set aws_access_key_id $(AWS_ACCESS_KEY_ID) --profile $(PROFILE)
	@aws configure set aws_secret_access_key $(AWS_SECRET_ACCESS_KEY) --profile $(PROFILE)

# Generates ECR (Elastic Container Registry) repos, given the proper credentials
create-ecr-repos:
	@echo "+\n++ Creating EC2 Container repositories...\n+"
	@$(shell aws ecr get-login --no-include-email --profile $(PROFILE) --region $(REGION))
	@aws ecr create-repository --profile $(PROFILE) --region $(REGION) --repository-name $(PROJECT) || :
	@aws iam attach-role-policy --role-name aws-elasticbeanstalk-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly --profile $(PROFILE) --region $(REGION)

##############################
# Local development commands #
##############################

build-local-development:
	@echo "+\n++ Building local development Docker image...\n+"
	@docker build -t $(PROJECT):dev -f ./app/docker/Dockerfile.development ./app/

build-local-production:
	@echo "+\n++ Building local production Docker image...\n+"
	@docker build -t $(PROJECT):production -f ./app/Dockerfile.production ./app/

run-local-development:
	@echo "+\n++ Running development container locally\n+"
	@docker run -d -it --name $(PROJECT)-dev -p 3000:3000 -v "$(CURDIR)/app:/app" -v /app/node_modules $(PROJECT):dev

run-local-production:
	@echo "+\n++ Running production container locally\n+"
	@docker run -d -it --name $(PROJECT)-production -p 3001:3000 $(PROJECT):production

close-local-development:
	@echo "+\n++ Closing local development container\n+"
	@docker rm -f $$(docker ps -q --filter name=$(PROJECT)-development)

close-local-production:
	@echo "+\n++ Closing local production container\n+"
	@docker rm -f $$(docker ps -q --filter name=$(PROJECT)-production)

development-workspace:
	@docker exec -it $(PROJECT)-dev bash

##########################################
# Pipeline build and deployment commands #
##########################################

pipeline-build:
	@echo "+\n++ Performing build of Docker images...\n+"
	@echo "Tagging images with: $(GIT_LOCAL_BRANCH)"
	@docker-compose -f docker-compose.production.yml build

pipeline-push:
	@echo "+\n++ Pushing image to Dockerhub...\n+"
	@$(shell aws ecr get-login --no-include-email --region $(REGION) --profile $(PROFILE))
	@docker tag $(PROJECT):$(GIT_LOCAL_BRANCH) $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(MERGE_BRANCH)
	@docker push $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(MERGE_BRANCH)

pipeline-deploy-prep:
	@echo "+\n++ Creating Dockerrun.aws.json file...\n+"
	@.build/env_options.sh < .env > .ebextensions/options.config
	@.build/build_dockerrun.sh > Dockerrun.aws.json

pipeline-deploy-version:
	@echo "+\n++ Deploying to Elasticbeanstalk...\n++"
	@zip -r $(call deployTag).zip .ebextensions Dockerrun.aws.json
	@aws --profile $(PROFILE) configure set region $(REGION)
	@aws --profile $(PROFILE) s3 cp $(call deployTag).zip s3://$(S3_BUCKET)/$(PROJECT)/$(call deployTag).zip
	@aws --profile $(PROFILE) elasticbeanstalk create-application-version --application-name $(PROJECT) --version-label $(call deployTag) --source-bundle S3Bucket="$(S3_BUCKET)",S3Key="$(PROJECT)/$(call deployTag).zip"
	@aws --profile $(PROFILE) elasticbeanstalk update-environment --application-name $(PROJECT) --environment-name $(DEPLOY_ENV) --version-label $(call deployTag)

pipeline-healthcheck:
	@aws --profile $(PROFILE) elasticbeanstalk describe-environments --application-name $(PROJECT) --environment-name $(DEPLOY_ENV) --query 'Environments[*].{Status: Status, Health: Health}'

############################################
# Pipeline lint, test, and report commands #
############################################

pipeline-lint:
	@echo "+\n++ Linting project...\n+"
	@docker-compose -f docker-compose.production.yml run --entrypoint "npm run lint" test

pipeline-tests:
	@echo "+\n++ Running tests...\n+"
	@docker-compose -f docker-compose.production.yml run --name $(PROJECT)-test test

pipeline-docs:
	@echo "+\n++ Generating docs \n+"
	# @docker-compose -f docker-compose.production.yml up -d application
	# @docker-compose exec -T application npm run test:cov
	# @docker-compose exec -T application npm run typedoc
	# @docker-compose -f docker-compose.production.yml up -d postgres
	# export UID=$(id -u)
	# export GID=$(id -g)
	# @docker-compose -f docker-compose.production.yml run --rm --name schema schemaspy

pipeline-report:
	@echo "+\n++ Report \n+"

pipeline-copy-docs:
	@echo "+\n++ Copying docs\n+"
	# @docker cp schema:/output ./app/documentation/
	# @mv ./app/documentation/output ./app/documentation/schema
	# @docker cp $(PROJECT):/usr/src/app/documentation ./app

pipeline-sonarqube:
	@echo "+\n++ Start SonarQube\n+"
	@docker run -d --name SonarQube -p 9000:9000 -p 9092:9092 sonarqube

pipeline-upload-documentation:
	@echo "+\n++ Upload documentation\n+"
	# @aws --profile $(PROFILE) s3 sync --delete ./app/documentation/ s3://vaping-regulation-docs/ --acl public-read

##############################
# Pipeline clean up commands #
##############################

pipeline-clean-up:
	@echo "+\n++ Cleaning up...\n+"
	@docker-compose -f docker-compose.production.yml down
