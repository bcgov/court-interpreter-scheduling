import React from 'react'
import { Redirect } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { KeycloakInstance } from 'keycloak-js'

export default function KeycloakRedirect () {

  const { keycloak } = useKeycloak<KeycloakInstance>()
  // NB: this component is here in case we want to do anything on return to app from auth
  // may remove if we can just redirect to root directly
  return keycloak?.authenticated
    ?
      <Redirect to='/' />
    :
      keycloak?.loginRequired
    ?
      <Redirect to='/login' />
    :
      <h4>Authenticating...</h4>
}
