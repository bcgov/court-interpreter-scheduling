import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import { ReactKeycloakProvider as KeycloakProvider, useKeycloak } from '@react-keycloak/web'
import keycloakClient from './keycloak'
import { KeycloakInstance } from 'keycloak-js'

import { ThemeProvider, Box, CircularProgress } from '@material-ui/core'
import 'css/App.css'
import '@bcgov/bc-sans/css/BCSans.css'
import { theme } from 'theme'

import axios, { AxiosRequestConfig } from 'axios'
import { configure } from 'axios-hooks'

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

axios.defaults.baseURL = '/api/v1'

const Signup = lazy(() => import('views/register'))
const Login = lazy(() => import('views/login'))
const KeycloakRedirect = lazy(() => import('views/Keycloak'))
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
      initOptions={{
        pkceMethod: 'S256',
      }}
      onTokens={({ token }) => {
        axios.interceptors.request.use(
          (config: AxiosRequestConfig): AxiosRequestConfig => {
            config.headers.Authorization = `Bearer ${token}`
            return config
          },
        )
        configure({ axios })
      }}
    >
      <BrowserRouter>
        <Suspense fallback={<Box p={2}><CircularProgress /></Box>}>
          <ThemeProvider theme={theme}>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={Signup} />
              <Route exact path='/keycloak' component={KeycloakRedirect} />
              <PrivateRoute path='/' component={App} />
            </Switch>
          </ThemeProvider>
        </Suspense>
      </BrowserRouter>
    </KeycloakProvider>
  )
}

render(<Routes />, document.getElementById('root'))
