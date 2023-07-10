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
  const dailyPlanners = useSelector(state => state.daily_planner.dailyPlanner)
  console.log('DAILY PLANNERS --->', dailyPlanners)
  const slots = useSelector(state => state.daily_planner.slots.slots)
  console.log('SLOTS INSIDE DP COMPONENT --->', slots)
  const [currentSlide, setCurrentSlide] = useState(
    getCurrentDailyPlannerIndex()
  )
  const [slotId, setSlotId] = useState('')
  const [isCreateTodoModalOpen, setIsCreateTodoModalOpen] = useState(false)
  const dispatch = useDispatch()

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

  useEffect(() => {
    setCurrentSlide(getCurrentDailyPlannerIndex())
  }, [dailyPlanners])

  // Helper function to get the index of the current daily planner
function getCurrentDailyPlannerIndex () {
  if (!dailyPlanners || dailyPlanners.length === 0) {
    return 0 // Return 0 if no daily planners are available
  }

  const currentDate = new Date()
  currentDate.setUTCHours(0, 0, 0, 0) // Set time to 00:00:00 GMT
  console.log('DATE --->', currentDate)

  for (let i = 0; i < dailyPlanners.length; i++) {
    const plannerDate = new Date(dailyPlanners[i].date)
    plannerDate.setUTCHours(0, 0, 0, 0) // Set time to 00:00:00 GMT
    if (plannerDate.getTime() === currentDate.getTime()) {
      return i // Return the index of the daily planner with matching date
    }
  }

  return 0 // Return 0 if no daily planner with matching date is found
}


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

  // Loading symbol
  if (!dailyPlanners) {
    return <div>Loading...</div>
  }

  // TIME SLOTS FOR EACH DAILY PLANNER
  const currentDailyPlanner = dailyPlanners[currentSlide]

  // Assign slotId for assigning a todo to a slot
  const handleSlotClick = slotId => {
    setSlotId(slotId)
    console.log('SLOT ID ---->', slotId)
    setIsCreateTodoModalOpen(true)
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
          <button onClick={goToPreviousSlide}>&lt;</button>
          <button onClick={goToNextSlide}>&gt;</button>
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
