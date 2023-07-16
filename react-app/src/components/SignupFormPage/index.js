import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { signUp } from '../../store/session'
import './SignupForm.css'

function SignupFormPage () {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [errors, setErrors] = useState([])

  if (sessionUser) return <Redirect to='/' />

  const handleSubmit = async e => {
    e.preventDefault()
    if (password === confirmPassword) {
      const data = await dispatch(
        signUp(fullName, username, email, password)
      )
      if (data) {
        setErrors(data)
      }
    } else {
      setErrors([
        'Confirm Password field must be the same as the Password field'
      ])
    }
  }

  return (
    <>
      <h1 className='signup-form'>Sign Up</h1>
      <form className='signup-form' onSubmit={handleSubmit}>
        <ul className='signup-form'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label className='signup-form'>
          Full Name
          <input
            className='signup-form'
            type='text'
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </label>
        <label className='signup-form'>
          Email
          <input
            className='signup-form'
            type='text'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label className='signup-form'>
          Username
          <input
            className='signup-form'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <label className='signup-form'>
          Password
          <input
            className='signup-form'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <label className='signup-form'>
          Confirm Password
          <input
            className='signup-form'
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>
        <button className='signup-form' type='submit'>
          Sign Up
        </button>
      </form>
    </>
  )
}

export default SignupFormPage
