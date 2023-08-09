import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { signUp } from '../../store/session'
import { Field, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faIdCard,
  faEnvelope,
  faUser,
  faKey,
  faLock
} from '@fortawesome/free-solid-svg-icons'

import Dropzone from 'react-dropzone'
import './SignupForm.css'

const SignupFormModal = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()
  const [isLoaded, setIsLoaded] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (password === confirmPassword) {
      const form = new FormData()
      form.append('full_name', fullName)
      form.append('username', username)
      form.append('email', email)
      form.append('password', password)
      form.append('profile_picture', profilePicture)

      setIsLoaded(true)
      const data = await dispatch(signUp(form))
      if (data && data.length > 0) {
        const errorObj = {}
        data.forEach(error => {
          const [key, value] = error.split(' : ')
          errorObj[key] = value
        })
        setErrors(errorObj)
        setIsLoaded(false)
      } else {
        closeModal()
      }
    } else {
      setErrors({
        confirmPassword:
          'Confirm Password field must be the same as the Password field'
      })
    }
  }

  return (
    <>
      <h1 className='signup-form-heading'>Sign Up</h1>
      <div className='singup-form-scrollable'>
        <form className='signup-form' onSubmit={handleSubmit}>
          <ul className='signup-form-errors'>
            {/* {Object.entries(errors).map(([key, error]) => (
            <li key={key}>{key}{error}</li>
          ))} */}
          </ul>
          <label className='signup-form-label'>
            Full Name
            <input
              className='signup-form-input'
              type='text'
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            {errors.full_name && (
              <span className='error-message'>{errors.full_name}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Email
            <input
              className='signup-form-input'
              type='text'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className='error-message'>{errors.email}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Username
            <input
              className='signup-form-input'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            {errors.username && (
              <span className='error-message'>{errors.username}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Password
            <input
              className='signup-form-input'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className='error-message'>{errors.password}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Confirm Password
            <input
              className='signup-form-input'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <span className='error-message'>{errors.confirmPassword}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Profile Picture
            <Dropzone
              onDrop={acceptedFiles => setProfilePicture(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className='dropzone'>
                  <input
                    {...getInputProps()}
                    onChange={e => setProfilePicture(e.target.files[0])}
                  />
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt='Profile'
                      className='profile-picture-preview'
                    />
                  ) : (
                    <p>Drag and drop an image here or click to select a file</p>
                  )}
                </div>
              )}
            </Dropzone>
            {errors.profile_picture && (
              <span className='error-message'>{errors.profile_picture}</span>
            )}
          </label>

          {isLoaded ? (
            <div className='loading-symbol'></div> // Display the loading symbol if isLoaded is true
          ) : (
            <button className='signup-form-button' type='submit'>
              Sign Up
            </button>
          )}
        </form>
      </div>
    </>
  )
}

export default SignupFormModal
