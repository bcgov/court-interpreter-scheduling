import React, { useState, lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Box, CircularProgress } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Header from 'components/layout/Header';
import SubHeader from 'components/layout/SubHeader';
import ContentHeader from 'components/layout/ContentHeader';
import Footer from 'components/layout/Footer';
import Error from 'components/Error';
import ErrorContext from 'contexts/ErrorContext';
import { AlertProvider } from 'hooks/useAlert';

const Booking = lazy(() => import('views/Booking'));
const CreateBooking = lazy(() => import('views/CreateBooking'));
const InterpreterDirectory = lazy(() => import('views/InterpreterDirectory'));

const App = () => {
  const [errorMessage, setError] = useState('');
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <AlertProvider>
        <ErrorContext.Provider
          value={{ message: errorMessage, updateErrorContext: setError }}
        >
          <Header />
          <SubHeader />
          <section className="content">
            <ContentHeader />
            <Suspense
              fallback={
                <Box p={2}>
                  <CircularProgress />
                </Box>
              }
            >
              <Switch>
                <Route exact path="/bookings" component={Booking} />
                <Route exact path="/create" component={CreateBooking} />
                <Route
                  exact
                  path="/directory"
                  component={InterpreterDirectory}
                />
                <Redirect to="/bookings" />
              </Switch>
            </Suspense>
          </section>
          <Footer />
          <Error />
        </ErrorContext.Provider>
      </AlertProvider>
    </MuiPickersUtilsProvider>
  );
};

export default App;
