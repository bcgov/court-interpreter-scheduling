import Keycloak from 'keycloak-js';

const keycloak: Keycloak.KeycloakInstance = Keycloak({
  realm: localStorage.getItem('keycloakRealm') || process.env.REACT_APP_KC_REALM || 'joxo7v8f',
  url: localStorage.getItem('keycloakAuthUrl') || process.env.REACT_APP_REALM_AUTH_URL,
  clientId: 'court-fe',
});

export default keycloak;
