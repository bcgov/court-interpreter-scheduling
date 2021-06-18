import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { KeycloakInstance } from 'keycloak-js'

import { Box, Typography, Grid } from '@material-ui/core'

import Header from 'components/layout/Header'
import Footer from 'components/layout/Footer'
import { ButtonPrimary } from 'components/Buttons'

const Login = () => {
  const { keycloak } = useKeycloak<KeycloakInstance>()
  return (
    <>
      <Header />
      <section className='login-container'>
        <Grid container>
          <Grid item xs={6}>
            <div className='login-form'>
              <ButtonPrimary onClick={() => keycloak?.login({ redirectUri: `${window.location.origin}${process.env.PUBLIC_URL}`})}>
                Log In
              </ButtonPrimary>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Box pb={2}>
              <Typography variant='h2' color='primary'>Need Help?</Typography>
            </Box>
            <Box pb={2}>
              <Typography variant='body2'>
                Contact your security administrator or the 7-7000 Service Desk at:
              </Typography>
            </Box>
            <Box pb={1}>
              <Typography variant='body2'>
                Phone: 250-387-7000
              </Typography>
            </Box>
            <Box pb={1}>
              <Typography variant='body2'>
                Email: 77000@gov.bc.ca
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </section>
      <Footer />
    </>
  )
}

export default Login
