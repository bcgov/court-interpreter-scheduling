import React, { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import store from 'store'
import './App.css'

const Signup = lazy(() => import('./views/signup'))
const Login = lazy(() => import('./views/login'))
const App = lazy(() => import('./App'))

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
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          <PrivateRoute path='/' component={App} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}
render(<Routes />, document.getElementById('root'))
