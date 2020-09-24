import React, { Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Header from './components/layout/Header'
import SubHeader from './components/layout/SubHeader'
import Footer from './components/layout/Footer'

const Booking = lazy(() => import('./views/Booking'))
const Directory = lazy(() => import('./views/Directory'))

const App = () => {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <Header />
        <SubHeader />
        <section className='content'>
          <Switch>
            <Route exact path='/directory' component={Directory} />
            <Route exact path='/booking' component={Booking} />
            <Redirect to='/booking' />
          </Switch>
        </section>
        <Footer />
      </Suspense>
    </>
  )
}

export default App
