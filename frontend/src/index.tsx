import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import { ReactKeycloakProvider as KeycloakProvider, useKeycloak } from '@react-keycloak/web'
import keycloakClient from './keycloak'
import { KeycloakInstance } from 'keycloak-js'

import { ThemeProvider, Box, CircularProgress } from '@material-ui/core'
import 'react-nice-dates/build/style.css'
import 'css/App.css'
import '@bcgov/bc-sans/css/BCSans.css'
import { theme } from 'theme'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

const Login = lazy(() => import('views/login'))
const App = lazy(() => import('App'))

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const { keycloak } = useKeycloak<KeycloakInstance>()
  return (
    <Route
      {...rest}
      render={props =>
        keycloak?.authenticated ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}

const Routes = () => {
  return (
    <KeycloakProvider
      authClient={keycloakClient}
      LoadingComponent={<Box p={2}><CircularProgress /></Box>}
    >
      <BrowserRouter>
        <Suspense fallback={<Box p={2}><CircularProgress /></Box>}>
          <ThemeProvider theme={theme}>
            <Switch>
              <Route exact path='/login' component={Login} />
              <PrivateRoute path='/' component={App} />
            </Switch>
          </ThemeProvider>
        </Suspense>
      </BrowserRouter>
    </KeycloakProvider>
  )
}

render(<Routes />, document.getElementById('root'))
