import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { ThemeProvider, Box, CircularProgress } from '@material-ui/core'
import store from 'store'
import axios from 'axios';

import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css';

import 'css/App.css'
import '@bcgov/bc-sans/css/BCSans.css'
import { theme } from 'theme'

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '/api/v1' : '/'

const Signup = lazy(() => import('views/register'))
const Login = lazy(() => import('views/login'))
const App = lazy(() => import('App'))

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const token = store.get('TOKEN')
  return (
    <Route
      {...rest}
      render={props =>
        token ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}

const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Box p={2}><CircularProgress /></Box>}>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <PrivateRoute path='/' component={App} />
          </Switch>
        </ThemeProvider>
      </Suspense>
    </BrowserRouter>
  )
}
render(<Routes />, document.getElementById('root'))
