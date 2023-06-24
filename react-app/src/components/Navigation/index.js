import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ProfileButton from './ProfileButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faArrowRightFromBracket,
  faSquarePlus,
  faList,
  faGear
} from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../store/session'
import './Navigation.css'

function Navigation ({ isLoaded, user }) {
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className='navigation'>
      <ul className='navigation-container-profile'>
        {isLoaded && (
          <li className={`profile-right-nav${user ? '' : ' flex-column'}`}>
            <ProfileButton user={sessionUser} />
          </li>
        )}
        {user && (
          <li className='navigation-item'>
            <NavLink exact to='/' className='navigation-link'>
              <FontAwesomeIcon icon={faHome} />{' '}
            </NavLink>
          </li>
        )}
      </ul>
<div className='left-side-bar'>

      <ul className='navigation-container'>
        <li className='navigation-item'>
          <NavLink exact to='/' className='navigation-link'>
            <FontAwesomeIcon icon={faHome} />{' '}
          </NavLink>
        </li>
        {isLoaded && sessionUser && (
          <ul className='navigation-items-logged-in'>
            <li className='navigation-item'>
              <NavLink exact to='/' className='navigation-link'>
                <FontAwesomeIcon icon={faSquarePlus} />{' '}
              </NavLink>
            </li>
            <li className='navigation-item'>
              <NavLink exact to='/' className='navigation-link'>
                <FontAwesomeIcon icon={faList} />{' '}
              </NavLink>
            </li>
            <li className='navigation-item'>
              <button className='profile-icon' onClick={handleLogout}>
                <FontAwesomeIcon icon={faGear} />{' '}
              </button>
            </li>
            <li className='navigation-item'>
              <button className='profile-icon' onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />{' '}
              </button>
            </li>
          </ul>
        )}
      </ul>
            </div>
    </div>
  )
}

export default Navigation
