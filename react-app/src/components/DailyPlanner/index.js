import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory } from 'react-router-dom'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk
} from '../../store/daily_planner'
import CreateTodoModal from '../ToDos/CreateTodoModal'
import OpenModalButton from '../../components/OpenModalButton'
import './DailyPlanner.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faPencil
} from '@fortawesome/free-solid-svg-icons'

function DailyPlanner () {
  const dailyPlanners = useSelector(state => state.daily_planner.dailyPlanner)
  const slots = useSelector(state => state.daily_planner.slots.slots)
  const [currentSlide, setCurrentSlide] = useState(
    getCurrentDailyPlannerIndex()
  )
  const [slotId, setSlotId] = useState('')
  const dispatch = useDispatch()

  // FETCH DAILY PLANNERS
  useEffect(() => {
    dispatch(fetchDailyPlannersThunk())
  }, [dispatch])

  // SET SLIDES FOR DAILY PLANNER SLIDESHOW
  useEffect(() => {
    if (dailyPlanners && dailyPlanners.length > 0) {
      dispatch(fetchDailyPlannerSlotsThunk(dailyPlanners[currentSlide].id))
    }
  }, [dailyPlanners, currentSlide, dispatch])

  useEffect(() => {
    setCurrentSlide(getCurrentDailyPlannerIndex())
  }, [dailyPlanners])

  // DAILY PLANNER INDEX HELPER FUNCTION - to find + display today's date as 1st daily planner in list
  function getCurrentDailyPlannerIndex () {
    if (!dailyPlanners || dailyPlanners.length === 0) {
      return 0
    }

    const currentDate = new Date()
    currentDate.setUTCHours(0, 0, 0, 0)

    for (let i = 0; i < dailyPlanners.length; i++) {
      const plannerDate = new Date(dailyPlanners[i].date)
      plannerDate.setUTCHours(0, 0, 0, 0)
      if (plannerDate.getTime() === currentDate.getTime()) {
        return i
      }
    }

    return 0
  }

  // SLIDE FUNCTIONALITY
  const goToPreviousSlide = () => {
    setCurrentSlide(prevSlide =>
      dailyPlanners.length > 1
        ? prevSlide === 0
          ? dailyPlanners.length - 1
          : prevSlide - 1
        : prevSlide
    )
  }

  const goToNextSlide = () => {
    setCurrentSlide(prevSlide =>
      dailyPlanners.length > 1
        ? prevSlide === dailyPlanners.length - 1
          ? 0
          : prevSlide + 1
        : prevSlide
    )
  }

  // LOADING SYMBOL
  if (!dailyPlanners) {
    return <div>Loading...</div>
  }

  // CURRENT DAILY PLANNER VARIABLE
  const currentDailyPlanner = dailyPlanners[currentSlide]

  // ASSIGN SLOT ID - associates a todo with a specific time
  const handleSlotClick = slotId => {
    setSlotId(slotId)
  }

  // DATE/TIME FORMATTING
  const getOrdinalSuffix = day => {
    if (day >= 11 && day <= 13) {
      return 'th'
    }
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000 // Get the time zone offset in milliseconds
    const adjustedDate = new Date(date.getTime() + timeZoneOffset) // Adjust the date by adding the time zone offset
    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    const formattedDate = adjustedDate.toLocaleDateString('en-US', options)
    const day = adjustedDate.getDate()
    const suffix = getOrdinalSuffix(day)
    return formattedDate.replace(/(\d+)$/, `$1${suffix}`)
  }

  const formatTime = timeString => {
    const date = new Date(`2000-01-01T${timeString}`)
    return date.toLocaleTimeString([], { hour: 'numeric' })
  }

  return (
    <div>
      <h1>Daily Planner</h1>
      <div className='subheading'>
        <p>To Do | {formatDate(currentDailyPlanner.date)}</p>
        <div className='slideshow-controls'>
          <button className='slideshow-button' onClick={goToPreviousSlide}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button className='slideshow-button' onClick={goToNextSlide}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      <div className='time-slots-start-end'>
        {slots &&
          slots.map(slot => (
            <div className='time-slot' key={slot.id}>
              <p className='time'>
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </p>
              <input
                className='time-slot-field'
                type='text'
                value={(slot['todo'] && slot.todo.name) || ''}
                readOnly
              />
              <OpenModalButton
                modalComponent={
                  <CreateTodoModal
                    slotId={slot.id}
                    plannerId={currentDailyPlanner.id}
                  />
                }
                buttonText={<FontAwesomeIcon icon={faPencil} />}
                handleSlotClick={handleSlotClick}
                slotId={slot.id}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default DailyPlanner
