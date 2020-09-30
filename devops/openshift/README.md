# Deploy DB

## Local Minishift

1. Login into remote minishift machine and port forward 8443
    ssh -i ~/.fw/private_keys/court-scheduler-dev-minishift -L 8443:localhost:8443 centos@ssh.court-scheduler.freshworks.club

2. Login into oc remote instance (open minishift console https://localhost:8443/console and copy login cmd)
    example: oc login https://localhost:8443 --token=BRE4mBcgc1vl43a1bBSGRFNcG05CFcXKggK-vv5mxWQ

3. Select project
    oc project courtsh

4. Create github secret in openshift project so it can clone git repo. (One time action)
    oc create secret generic git-secret --from-file=ssh-privatekey=../repo-at-github --type=kubernetes.io/ssh-auth

5. Link Secret with builder ((One time action))
    oc secrets link builder git-secret

6. Create/update api build config
    oc process -f api.bc.yml | oc apply -f -
    oc process --param=SOURCE_REPOSITORY_REF=dev -f api.bc.yml | oc apply -f - (with params)

7. Start api build and wait
    oc start-build bc/court-schedule-api-dev --wait

8. Deploy Database pod
    oc process -f db.dc.yml | oc apply -f -

9. Create/Update API deployment config (Create DB deployment first then deploy api, api dc has dependency on DB deployment)
    oc process -f api.dc.yml | oc apply -f -
