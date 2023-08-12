import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { signUp } from '../../store/session'
import OpenModalButton from '../OpenModalButton'
import LoginFormModal from '../LoginFormModal'
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

const SignupFormModal = ({ scrollToTop }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const { closeModal } = useModal()
  const [showMenu, setShowMenu] = useState(false)
  const modalContentRef = useRef(null)
  const ulRef = useRef()


  useEffect(() => {
    if (!showMenu) return

    const closeMenu = e => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', closeMenu)

    return () => document.removeEventListener('click', closeMenu)
  }, [showMenu])

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

  const closeMenu = () => setShowMenu(false)


  return (
    <div className='modal-content-wrapper' ref={modalContentRef}>
      <div className='signup-form-scrollable'>
        <form className='signup-form' onSubmit={handleSubmit}>
          <ul className='signup-form-errors'>
            {/* {Object.entries(errors).map(([key, error]) => (
            <li key={key}>{key}{error}</li>
          ))} */}
          </ul>
          <h1 className='signup-form-heading'>Sign Up</h1>
          <label className='signup-form-label'>
            Full Name
            <div className='input-icon-container'>
              <input
                className='signup-form-input'
                type='text'
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              <FontAwesomeIcon icon={faIdCard} className='input-icon' />
            </div>
            {errors.full_name && (
              <span className='error-message'>{errors.full_name}</span>
            )}
          </label>

          <label className='signup-form-label'>
            Email
            <div className='input-icon-container'>
              <input
                className='signup-form-input'
                type='text'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <FontAwesomeIcon icon={faEnvelope} className='input-icon' />
            </div>
            {errors.email && (
              <span className='error-message'>{errors.email}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Username
            <div className='input-icon-container'>
              <input
                className='signup-form-input'
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <FontAwesomeIcon icon={faUser} className='input-icon' />
            </div>
            {errors.username && (
              <span className='error-message'>{errors.username}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Password
            <div className='input-icon-container'>
              <input
                className='signup-form-input'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <FontAwesomeIcon icon={faKey} className='input-icon' />
            </div>
            {errors.password && (
              <span className='error-message'>{errors.password}</span>
            )}
          </label>
          <label className='signup-form-label'>
            Confirm Password
            <div className='input-icon-container'>
              <input
                className='signup-form-input'
                type='password'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon icon={faLock} className='input-icon' />
            </div>
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
            <>
              <button className='signup-form-button' type='submit'>
                Sign Up
              </button>
              <OpenModalButton
                className='login-btn'
                buttonText='Already a member? Log in'
                modalComponent={<LoginFormModal />}
              />
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default SignupFormModal
