import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

const Home = lazy(() => import('./views/home'))

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Header />
        <Switch>
          <Route exact path='/home' component={Home} />
          <Route path='/' component={Home} />
        </Switch>
        <Footer />
      </Suspense>
    </div>
  )
}

export default App
