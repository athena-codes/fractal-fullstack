import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/session'
import OpenModalButton from '../OpenModalButton'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from '../SignupFormModal'
import profile_picture from './images/user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

function ProfileButton ({ user }) {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef()
  console.log('USER --->', user)

  const openMenu = () => {
    if (showMenu) return
    setShowMenu(true)
  }

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

  const handleLogout = e => {
    e.preventDefault()
    dispatch(logout())
  }

  const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden')
  const closeMenu = () => setShowMenu(false)

  return (
    <>
      {user ? (
        <img
          className='profile-picture'
          src={user.profile_picture_url}
          alt='Profile'
        />
      ) : (
        <button className='profile-icon' onClick={openMenu}>
          <FontAwesomeIcon icon={faCircleUser} />
        </button>
      )}
      {user ? (
        <>
          <p className='welcome-msg'>Welcome, {user.full_name}</p>
        </>
      ) : (
        <>
          <ul className={ulClassName} ref={ulRef}>
            <OpenModalButton
            className='login-btn'
              buttonText='Log In'
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText='Sign Up'
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </ul>
        </>
      )}
    </>
  )
}

export default ProfileButton
