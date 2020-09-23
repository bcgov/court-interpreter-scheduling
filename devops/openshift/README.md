# Deploy DB

## Local Minishift

oc create secret generic git-secret --from-file=ssh-privatekey=../repo-at-github --type=kubernetes.io/ssh-auth
oc secrets link builder git-secret
oc set build-secret --source bc/court-schedule-api-dev git-secret
oc process -f api.bc.yml | oc apply -f -
oc process -f db.dc.yml | oc apply -f -
