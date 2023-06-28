import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory } from 'react-router-dom'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk,
  assignTodoToSlotThunk
} from '../../store/daily_planner'
import { createNewTodo } from '../../store/todos'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import CreateTodoModal from '../ToDos/CreateTodoModal'
import OpenModalButton from '../../components/OpenModalButton'

import './DailyPlanner.css'

function DailyPlanner () {
  const dispatch = useDispatch()
  const dailyPlanners = useSelector(state => state.daily_planner.dailyPlanner)
  const slots = useSelector(state => state.slots)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedSlotId, setSelectedSlotId] = useState(null)

  // Get all daily planners
  useEffect(() => {
    dispatch(fetchDailyPlannersThunk())
  }, [dispatch])

  // Get all daily planner slots for each daily planner and display on corresponding slide
  useEffect(() => {
    if (dailyPlanners && dailyPlanners.length > 0) {
      dispatch(fetchDailyPlannerSlotsThunk(dailyPlanners[currentSlide].id))
    }
  }, [dailyPlanners, currentSlide, dispatch])

  // Planner back and forward button functionality
  const goToPreviousSlide = () => {
    setCurrentSlide(prevSlide =>
      prevSlide === 0 ? dailyPlanners.length - 1 : prevSlide - 1
    )
  }

  const goToNextSlide = () => {
    setCurrentSlide(prevSlide =>
      prevSlide === dailyPlanners.length - 1 ? 0 : prevSlide + 1
    )
  }

  const handleSlotClick = slotId => {
    setSelectedSlotId(slotId)
  }

  const handleCreateTodo = async todoData => {
    try {
      const createdTodo = await dispatch(createNewTodo(todoData))
      await dispatch(assignTodoToSlotThunk(selectedSlotId, createdTodo.id))
      setSelectedSlotId(null)
    } catch (error) {
      console.error(error)
      // Handle error as needed
    }
  }

  // Loading symbol
  if (!dailyPlanners) {
    return <div>Loading...</div>
  }

  // TIME SLOTS FOR EACH DAILY PLANNER
  const currentDailyPlanner = dailyPlanners[currentSlide]
  const dailyPlannerSlots = currentDailyPlanner.time_slots

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
    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options)
    const day = date.getDate()
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
        <li className='navigation-items-logged-in'>
          <OpenModalButton
            modalComponent={
              <CreateTodoModal
                onCreateTodo={handleCreateTodo}
                onClose={() => setSelectedSlotId(null)}
              />
            }
            buttonText={<FontAwesomeIcon icon={faPencil} />}
          />
        </li>
        <div className='slideshow-controls'>
          <button onClick={goToPreviousSlide}>&lt;</button>
          <button onClick={goToNextSlide}>&gt;</button>
        </div>
      </div>
      <div className='slideshow-container'>
        <div className='slide active'>
          <div className='time-slots'>
            {dailyPlannerSlots &&
              dailyPlannerSlots.map(slot => (
                <div
                  className='time-slot'
                  key={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                >
                  <p className='time'>
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </p>
                  <input
                    className='time-slot-field'
                    type='text'
                    value={slot.todo_id || ''}
                    readOnly
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyPlanner