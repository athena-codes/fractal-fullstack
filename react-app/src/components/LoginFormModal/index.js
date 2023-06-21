import React, { useState } from 'react'
import { login } from '../../store/session'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import './LoginForm.css'

function LoginFormModal () {
  const dispatch = useDispatch()
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const { closeModal } = useModal()

  const handleSubmit = async e => {
    e.preventDefault()
    const data = await dispatch(login(credential, password))
    if (data) {
      setErrors(data)
    } else {
      closeModal()
    }
  }

  return (
    <>
      <h1 className='login-form'>Log In</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <ul className='login-form'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label className='login-form'>
          Username/Email
          <input
            className='login-form'
            type='text'
            value={credential}
            onChange={e => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='login-form'>
          Password
          <input
            className='login-form'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button className='login-form' type='submit'>
          Log In
        </button>
      </form>
    </>
  )
}

export default LoginFormModal
