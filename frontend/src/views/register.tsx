import React, { useState } from 'react'

const Signup = () => {
  const [values, setValue] = useState({
    name: '',
    email: '',
    password: ''
  })

  function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget
    setValue({ ...values, [name]: value })
  }

  console.log(values)

  return (
    <section className='signup-container'>
      <h1>Signup</h1>
      <form className='signup-form'>
        <input
          placeholder='Name'
          className='input'
          name='name'
          onChange={handleChangeValue}
          value={values.name}
        />
        <input
          placeholder='Email'
          name='email'
          className='input'
          onChange={handleChangeValue}
          value={values.email}
        />
        <input
          type='password'
          name='password'
          className='input'
          placeholder='Password'
          onChange={handleChangeValue}
          value={values.password}
        />
        <button className='button' onClick={() => console.log(values)}>
          Send
        </button>
      </form>
    </section>
  )
}
export default Signup
