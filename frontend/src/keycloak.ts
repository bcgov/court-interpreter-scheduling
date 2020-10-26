import Keycloak from 'keycloak-js'

const keycloak: Keycloak.KeycloakInstance = Keycloak({
  realm: 'court',
  url: process.env.NODE_ENV === 'production'
    ? 'https://court-interpreter-scheduling.apps.silver.devops.gov.bc.ca/auth'
    : 'http://127.0.0.1:9090/auth',
  clientId: 'court-fe'
})

export default keycloak
