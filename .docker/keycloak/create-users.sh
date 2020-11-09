#!/bin/sh
/opt/jboss/keycloak/bin/add-user-keycloak.sh -r court -u cypress-clerk -p clerkOfTheCourt --roles court-admin
/opt/jboss/keycloak/bin/add-user-keycloak.sh -r court -u cypress-admin -p adminOfTheCourt
