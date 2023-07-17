import React, { useState } from 'react'
import { login } from '../../store/session'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import './LoginForm.css'

function LoginFormModal () {
  const dispatch = useDispatch()
  const [loginCredential, setLoginCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()

  const handleSubmit = async e => {
    e.preventDefault()
    const data = await dispatch(login(loginCredential, password))
    if (data) {
      const errorObj = {}
      data.forEach(error => {
        const [key, value] = error.split(' : ')
        errorObj[key] = value
      })
      setErrors(errorObj)
    } else {
      closeModal()
    }
  }

  return (
    <>
      <h1 className='login-form'>Log In</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <ul className='login-form'>
          {/* {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))} */}
        </ul>
        <label className='login-form'>
          Username/Email
          <input
            className='login-form'
            type='text'
            value={loginCredential}
            onChange={e => setLoginCredential(e.target.value)}
          />
          {errors.credential && (
            <span className='error-message-login'>{errors.credential}</span>
          )}
        </label>
        <label className='login-form'>
          Password
          <input
            className='login-form'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className='error-message-login'>{errors.password}</span>
          )}
        </label>

        <button className='login-form' type='submit'>
          Log In
        </button>
        <button
          className='demo-btn'
          onClick={async e => {
            e.preventDefault()
            const demoCredential = 'hgranger'
            const demoPassword = 'password'
            const data = await dispatch(login(demoCredential, demoPassword))
            if (data) {
              setErrors(data)
            } else {
              closeModal()
            }
          }}
        >
          Demo User
        </button>
      </form>
    </>
  )
}

export default LoginFormModal
