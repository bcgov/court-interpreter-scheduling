import Keycloak from 'keycloak-js'

const keycloak: Keycloak.KeycloakInstance = Keycloak({
  realm: 'court',
  url: process.env.NODE_ENV === 'production' ? 'https://secure-keycloak-court-interpreter-scheduler.pathfinder.gov.bc.ca/auth/admin' : 'http://127.0.0.1:9090/auth',
  clientId: 'court-fe'
})

export default keycloak
