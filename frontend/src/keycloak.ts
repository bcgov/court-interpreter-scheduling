import Keycloak from 'keycloak-js';

let kc: Keycloak.KeycloakInstance = Keycloak({
  realm:
    localStorage.getItem('keycloakRealm') ||
    process.env.REACT_APP_KC_REALM ||
    'joxo7v8f',
  url:
    localStorage.getItem('keycloakAuthUrl') ||
    process.env.REACT_APP_REALM_AUTH_URL,
  clientId: 'court-fe',
});

const keycloak = (authUrl?: string | null) => {
  if (authUrl) {
    kc = Keycloak({
      realm:
        localStorage.getItem('keycloakRealm') ||
        process.env.REACT_APP_KC_REALM ||
        'joxo7v8f',
      url:
        localStorage.getItem('keycloakAuthUrl') ||
        process.env.REACT_APP_REALM_AUTH_URL,
      clientId: 'court-fe',
    });
  }

  return kc;
};

export default keycloak;
