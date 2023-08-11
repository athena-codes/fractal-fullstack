import React, { useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ProfileButton from './ProfileButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faArrowRightFromBracket,
  faSquarePlus,
  faList,
  faGear,
  faBullseye,
  faNoteSticky
} from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../store/session'
import { useModal } from '../../context/Modal'
import OpenModalButton from '../OpenModalButton'
import CreateGoalModal from '../Goals/CreateGoalModal'
import './Navigation.css'

function Navigation ({ isLoaded, user }) {
  const sessionUser = useSelector(state => state.session.user)
  const { closeModal } = useModal()
  const history = { useHistory }
  const dispatch = useDispatch()

  const handleLogout = async e => {
    e.preventDefault()
    await dispatch(logout())
    // history.push('/')
    window.location.href = '/'
  }

  return (
    <div className='navigation'>
  
        {isLoaded && (
          <li className={`profile-right-nav${user ? '' : ' flex-column'}`}>
            <ProfileButton user={sessionUser} />
          </li>
        )}

      <div className='left-side-bar'>
        <ul className='navigation-container'>
          {isLoaded && sessionUser && (
            <ul className='navigation-items-logged-in'>
              <li className='navigation-item'>
                <NavLink exact to='/' className='navigation-link'>
                  <FontAwesomeIcon icon={faHome} />{' '}
                </NavLink>
              </li>
              <li className='navigation-item modal-btn'>
                <OpenModalButton
                  buttonText={<FontAwesomeIcon icon={faSquarePlus} />}
                  modalComponent={<CreateGoalModal />}
                />
              </li>
              <li className='navigation-item'>
                <NavLink exact to='/goals' className='navigation-link'>
                  <FontAwesomeIcon icon={faBullseye} />{' '}
                </NavLink>
              </li>
              <li className='navigation-item'>
                <NavLink exact to='/daily-planner' className='navigation-link'>
                  <FontAwesomeIcon icon={faList} />{' '}
                </NavLink>
              </li>

              <li className='navigation-item'>
                <NavLink exact to='/notes' className='navigation-link'>
                  <FontAwesomeIcon icon={faNoteSticky} />{' '}
                </NavLink>
              </li>
              <div className='logout-settings-nav-bar'>
                <li className='navigation-item'>
                  <button
                    className='profile-icon'
                    onClick={() => alert('Coming soon!')}
                  >
                    <FontAwesomeIcon icon={faGear} />{' '}
                  </button>
                </li>
                <li className='navigation-item nav-logout'>
                  <button className='profile-icon' onClick={handleLogout}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />{' '}
                  </button>
                </li>
              </div>
            </ul>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Navigation
