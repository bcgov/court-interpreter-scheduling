import React, { lazy, Suspense, useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import { useAxiosGet } from 'hooks/axios';
import {
  ReactKeycloakProvider as KeycloakProvider,
  useKeycloak,
} from '@react-keycloak/web';
import keycloakClient from './keycloak';
import { KeycloakInstance } from 'keycloak-js';

import { ThemeProvider, Box, CircularProgress } from '@material-ui/core';
import 'react-nice-dates/build/style.css';
import 'css/App.css';
import '@bcgov/bc-sans/css/BCSans.css';
import { theme } from 'theme';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const Login = lazy(() => import('views/login'));
const App = lazy(() => import('App'));

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak?.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const Routes = () => {
  return (
    <KeycloakProvider
      authClient={keycloakClient}
      LoadingComponent={
        <Box p={2}>
          <CircularProgress />
        </Box>
      }
      initOptions={{ checkLoginIframe: false }}
    >
      <BrowserRouter>
        <Suspense
          fallback={
            <Box p={2}>
              <CircularProgress />
            </Box>
          }
        >
          <ThemeProvider theme={theme}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <PrivateRoute path="/" component={App} />
            </Switch>
          </ThemeProvider>
        </Suspense>
      </BrowserRouter>
    </KeycloakProvider>
  );
};

const Start: React.FC = () => {
  const [{ data, error, loading }, getConfig] = useAxiosGet('/config');
  useEffect(() => {
    getConfig();
  }, []);
  if (loading) {
    return (
      <Box p={2}>
        <CircularProgress />
      </Box>
    );
  } else if (error) {
    return <div>error</div>;
  } else {
    const { keycloakAuthUrl, keycloakRealm } = data;
    localStorage.setItem('keycloakAuthUrl', keycloakAuthUrl);
    localStorage.setItem('keycloakRealm', keycloakRealm);
    return <Routes />;
  }
};

render(<Start />, document.getElementById('root'));
