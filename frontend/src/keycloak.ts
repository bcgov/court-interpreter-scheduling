import Keycloak from 'keycloak-js';

const keycloak: Keycloak.KeycloakInstance = Keycloak({
  realm: process.env.KC_REALM || 'court',
  url: process.env.REACT_APP_REALM_AUTH_URL,
  clientId: 'court-fe',
});

export default keycloak;
