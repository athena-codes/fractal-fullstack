import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { signUp } from '../../store/session'
import './SignupForm.css'

function SignupFormModal () {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [errors, setErrors] = useState([])
  const { closeModal } = useModal()

  const handleSubmit = async e => {
    e.preventDefault()
    if (password === confirmPassword) {
      const data = await dispatch(signUp(fullName, username, email, password))
      if (data) {
        setErrors(data)
      } else {
        closeModal()
      }
    } else {
      setErrors([
        'Confirm Password field must be the same as the Password field'
      ])
    }
  }

  return (
    <>
      <h1 className='signup-form-heading'>Sign Up</h1>
      <form className='signup-form' onSubmit={handleSubmit}>
        <ul className='signup-form-errors'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label className='signup-form-label'>
          Full Name
          <input
            className='signup-form-input'
            type='text'
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </label>
        <label className='signup-form-label'>
          Email
          <input
            className='signup-form-input'
            type='text'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label className='signup-form-label'>
          Username
          <input
            className='signup-form-input'
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label className='signup-form-label'>
          Password
          <input
            className='signup-form-input'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <label className='signup-form-label'>
          Confirm Password
          <input
            className='signup-form-input'
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className='signup-form-button' type='submit'>
          Sign Up
        </button>
      </form>
    </>
  )
}

export default SignupFormModal
