import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { KeycloakInstance } from 'keycloak-js'

const Login = () => {
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>()

  function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    keycloak?.login({ redirectUri: `${window.location.origin}/keycloak` })
  }

  return initialized ? (
    <section className='login-container'>
      <h1>Login</h1>
      <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
        <button id='loginButton' className='button'>
          Login
        </button>
      </form>
    </section>
  ) : <p>Loading auth</p>
}

export default Login
