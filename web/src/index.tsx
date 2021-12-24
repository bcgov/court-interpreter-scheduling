import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import { useAxiosGet } from 'hooks/axios';

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

  const [{ data, error, loading }, getUserInfo] = useAxiosGet('/user-info/');

  if (loading) 
    return (
      <Box p={2}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Redirect to="/" />
  if (!data?.user_id) return <Redirect to="/" />
      
  return (
    <Route
      {...rest}
      render={(props) =>
        data?.user_id? (          
          data.role.filter((role: {id: number, role_name: string; }) => {return (role.role_name=='cis-user' || role.role_name=='cis-admin')}).length >0  ?
          (
            <Component {...props} />
          )
            : 
            (
              <Box p={2}>
              <h4>Please request access from an administrator.</h4>
              </Box>
            )
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
  
};

const Routes = () => {
  
  return (
    // <KeycloakProvider
    //   authClient={keycloakClient(
    //     process.env.NODE_ENV === 'production'
    //       ? localStorage.getItem('keycloakAuthUrl')
    //       : ''
    //   )}
    //   LoadingComponent={
    //     <Box p={2}>
    //       <CircularProgress />
    //     </Box>
    //   }
    //   initOptions={{ checkLoginIframe: false }}
    // >
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Suspense
          fallback={
            <Box p={2}>
              <CircularProgress />
            </Box>
          }
        >
          <ThemeProvider theme={theme}>
            <Switch>
              <Route exact path="/" component={Login} />
              <PrivateRoute path="/home" component={App} />
            </Switch>
          </ThemeProvider>
        </Suspense>
      </BrowserRouter>
    
  );
};

// const Start: React.FC = () => {
//   // const [{ data, error, loading }] = useAxiosGet('/config');
//   // for debug the login issue on TEST env.
//   // console.info(data, error, loading);

//   // if (loading) {
//   // return (
//   //   <Box p={2}>
//   //     <CircularProgress />
//   //   </Box>
//   // );
//   // } else if (error) {
//   // return (
//   //   <Box p={2}>
//   //     <h4>Application Error.</h4>
//   //     <p>Could not connect to keycloak.</p>
//   //     {error.message ? <p>Error message: {error.message}</p> : null}
//   //   </Box>
//   // );
//   // } else if (data) {
//   //   const { keycloakAuthUrl, keycloakRealm, flag } = data;
//   //   localStorage.setItem('keycloakAuthUrl', keycloakAuthUrl);
//   //   localStorage.setItem('keycloakRealm', keycloakRealm);
//   //   localStorageUtil.storeData<boolean>(flag, 'flag');
//   //   console.info(
//   //     localStorage.getItem('keycloakAuthUrl'),
//   //     localStorage.getItem('keycloakRealm'),
//   //     localStorage.getItem('flag')
//   //   );
//   return <Routes />;
//   // }
//   // return null;
  
// };

render(
  // process.env.NODE_ENV === 'development' ? <Routes /> : <Start />,
  <Routes />,
  document.getElementById('root')
);
