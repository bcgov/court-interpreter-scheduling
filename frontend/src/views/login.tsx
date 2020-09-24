import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import store from 'store'

const Login = () => {
  const history = useHistory()
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget
    setValues({ ...values, [name]: value })
  }

  function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (values.password === 'password') {
      store.set('TOKEN', 'authToken')
      history.push('/')
    }
  }

  return (
    <section className='login-container'>
      <h1>Login</h1>
      <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
        <input
          className='input'
          placeholder='Email'
          name='email'
          onChange={handleChangeValue}
          value={values.email}
        />
        <input
          className='input'
          placeholder='Password'
          type='password'
          name='password'
          onChange={handleChangeValue}
          value={values.password}
        />
        <button className='button'>
          Send
        </button>
      </form>
      <button
        className='button-register'
        onClick={() => history.push('signup')}
      >
        ¡Signup!
      </button>
    </section>
  )
}
export default Login
