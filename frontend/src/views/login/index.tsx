import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

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

  return (
    <section className='login-container'>
      <h1>Login</h1>
      <form className='login-form'>
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
        <button className='button' onClick={() => console.log(values)}>
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
