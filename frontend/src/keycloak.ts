import Keycloak from 'keycloak-js'

const keycloak: Keycloak.KeycloakInstance = Keycloak({
  realm: 'court',
  url: 'http://127.0.0.1:9090/auth/',
  clientId: 'courts-fe'
})

export default keycloak
