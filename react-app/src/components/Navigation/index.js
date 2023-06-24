import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation ({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user)

  return (
    <ul className='navigation-container'>
      <li className='navigation-item'>
        <NavLink exact to='/' className='navigation-link'>
          Home
        </NavLink>
      </li>
      {isLoaded && (
        <li className='navigation-item'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  )
}

export default Navigation
