import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import aboutMePic from '../../components/images/about-me-pic.jpeg'
import './AboutMe.css'

const AboutMe = () => {
  let resumeData = {
    portfolio: [
      {
        name: 'Mockbnb',
        description: 'Airbnb website clone',
        imgurl: '../../components/images/portfolio/mockbnb.png',
        siteurl: 'https://mock-bnb.onrender.com'
      },
      {
        name: 'Zen Flow',
        description: 'Team management site inspired by Asana',
        imgurl: 'images/portfolio/zenflow.png',
        siteurl: 'https://zenflow-runs.onrender.com'
      },
      {
        name: 'Fractal',
        description: 'Fullstack daily planner and goal tracking application',
        imgurl: 'images/portfolio/fractal.png',
        siteurl: 'https://fractal-fullstack.onrender.com'
      },
      {
        name: 'SpaceX Clone',
        description: 'Pixel perfect clone of the SpaceX website',
        imgurl: 'images/portfolio/spacex.png',
        siteurl: 'https://spacex-pixel-perfect-clone.netlify.app/'
      }
    ]
  }

  console.log(resumeData)

  return (
    <>
      <Link to='/' className='modal-btn'>
        <FontAwesomeIcon icon={faHome} />{' '}
      </Link>
      <div className='about-me-container'>
        <h1 className='about-me-title'>About Me</h1>

        <div className='profile-section'>
          <img
            src={aboutMePic}
            alt='Athena'
            className='about-me-profile-picture'
          />
          <div className='profile-blurb-box'>
            <p className='profile-blurb'>
              Hello there! I'm Athena, a dedicated software engineer based in
              the greater Boston area. Currently enrolled in App Academy's
              immersive 48-week Software Engineering bootcamp, I've had the
              privilege of developing a diverse skill set in front-end UI/UX
              design, backend development, and data management. My proficiency
              in programming languages like Javascript, Python, HTML/CSS, SQL
              and expertise in frameworks such as Express and Flask enables me
              to create impactful and innovative applications. I thrive on
              tackling complex challenges and creating efficient, elegant
              solutions. I look forward to connecting with like-minded
              professionals and collaborating on exciting projects in the near
              future. Let's build something remarkable together!
            </p>
          </div>
        </div>

        <div className='projects-box'>
          <h1>My Projects</h1>
          <div
            id='portfolio-wrapper'
            className='bgrid-quarters s-bgrid-thirds cf'
          >
            {resumeData.portfolio &&
              resumeData.portfolio.map(item => {
                return (
                  <div className='columns portfolio-item'>
                    <a
                      href={item.siteurl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <div className='item-wrap'>
                        <div className='overlay'>
                          <div className='portfolio-item-meta'>
                            <h5>{item.name}</h5>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                )
              })}
          </div>
        </div>
        <div className='contact-info-box'>
          <div className='contact-info'>
            <h2>Conact Me!</h2>
            <p className='contact-name'>Athena Chiarello</p>
            <p className='contact-location'>Boston, MA</p>
            <p className='contact-email'>athenarose964@gmail.com</p>
          </div>

          <div className='social-links'>
            <a
              href='https://github.com/athena-codes'
              target='_blank'
              rel='noopener noreferrer'
              className='social-link'
            >
              <svg
                className='navbar-icon'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
                height='32'
                viewBox='0 0 16 16'
                version='1.1'
                width='32'
                data-view-component='true'
              >
                <path
                  d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'
                  fill='#808080'
                ></path>
              </svg>
            </a>
            <a
              href='https://www.linkedin.com/in/athena-chiarello-aa9774244/'
              target='_blank'
              rel='noopener noreferrer'
              className='social-link'
            >
              <svg
                className='navbar-icon'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                data-supported-dps='24x24'
                fill='#808080'
                width='32'
                height='32'
                focusable='false'
              >
                <path
                  d='M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z'
                  fill='#808080'
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutMe
