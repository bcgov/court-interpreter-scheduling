# OpenShift Commands

## BUILD

1. Build API
make oc-build-api BUILD_NS=l4izby-tools BRANCH=devops ID=1

2. Build App (Frontend)
make oc-build-app BUILD_NS=l4izby-tools BRANCH=devops ID=1

## Deploy

1. Database
make oc-deploy-db NS=l4izby-dev ID=1

2. API
make oc-deploy-api NS=l4izby-dev BUILD_NS=l4izby-tools ID=1 HPX=dev BR=devops

3. APP
make oc-deploy-app NS=l4izby-dev BUILD_NS=l4izby-tools ID=1 HPX=dev BR=devops
