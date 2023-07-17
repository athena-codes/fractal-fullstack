import React from 'react'
import './LandingPage.css'
import fractalGif from '../../assets/gifs/FRACTAL.mp4'

function LandingPage () {
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
        <button
          className='landing-page-button'
          onClick={() => alert('Coming soon!')}
        >
          About
        </button>
        <button
          className='landing-page-button'
          onClick={() => alert('Coming soon!')}
        >
          Get Started!
        </button>
      </div>
    </div>
  )
}

export default LandingPage
