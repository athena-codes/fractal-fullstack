import React, { useState } from 'react'
import './LandingPage.css'
import { NavLink } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton'
import SignupFormModal from '../SignupFormModal'

import fractalGif from '../../assets/gifs/FRACTAL.mp4'

function LandingPage () {
  const [showMenu, setShowMenu] = useState(false)

  const closeMenu = () => setShowMenu(false)

  return (
    <div className='landing-page'>
      <video className='landing-page-gif' autoPlay loop muted>
        <source src={fractalGif} type='video/mp4' />
      </video>
      <div className='landing-page-description'>
        <p>
          Welcome to Fractal - an innovative application designed to elevate
          your daily task planning and goal tracking experience. With Fractal,
          you can effortlessly build healthier habits and conquer your to-do
          list, all while making tangible progress towards your long-term
          aspirations.
        </p>
      </div>
      <div className='landing-page-buttons'>
        <div className='landing-page-button'>
          <NavLink to='/about-me' className='modal-btn'>
            About Me
          </NavLink>
        </div>

        <div className='landing-page-button'>
          <OpenModalButton
            buttonText='Get Started!'

            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
