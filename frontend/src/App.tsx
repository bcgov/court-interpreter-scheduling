import React, { useState, lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Box, CircularProgress } from '@material-ui/core'
import Header from 'components/layout/Header'
import SubHeader from 'components/layout/SubHeader'
import ContentHeader from 'components/layout/ContentHeader'
import Footer from 'components/layout/Footer'
import Error from 'components/Error'
import { ErrorContext } from 'contexts/ErrorContext'

const Booking = lazy(() => import('views/Booking'))
const Directory = lazy(() => import('views/Directory'))

const App = () => {
  const [errorMessage, setError] = useState('')
  return (
    <ErrorContext.Provider value={{ message: errorMessage, updateErrorContext: setError}}>
      <Header />
      <SubHeader />
      <section className='content'>
        <ContentHeader />
        <Suspense fallback={<Box p={2}><CircularProgress /></Box>}>
          <Switch>
            <Route exact path='/booking' component={Booking} />
            <Route exact path='/directory' component={Directory} />
            <Redirect to='/booking' />
          </Switch>
        </Suspense>
      </section>
      <Footer />
      <Error message={errorMessage} />
    </ErrorContext.Provider>
  )
}

export default App
