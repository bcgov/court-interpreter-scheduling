import Keycloak from 'keycloak-js';

let kc: Keycloak.KeycloakInstance = Keycloak({
  realm:
    localStorage.getItem('keycloakRealm') ||
    process.env.REACT_APP_KC_REALM ||
    'tz0e228w',
  url:
    localStorage.getItem('keycloakAuthUrl') ||
    process.env.REACT_APP_REALM_AUTH_URL,
  clientId: process.env.KEYCLOAK_FE_CLIENT ||
    'cis-web',
});

const keycloak = (authUrl?: string | null) => {
  if (authUrl) {
    kc = Keycloak({
      realm:
        localStorage.getItem('keycloakRealm') ||
        process.env.REACT_APP_KC_REALM ||
        'tz0e228w',
      url:
        localStorage.getItem('keycloakAuthUrl') ||
        process.env.REACT_APP_REALM_AUTH_URL,
      clientId: process.env.KEYCLOAK_FE_CLIENT ||
        'cis-web',
    });
  }

  return kc;
};

export default keycloak;
