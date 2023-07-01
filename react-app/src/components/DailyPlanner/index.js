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
  // const planners = useSelector(state => state.daily_planner)
  const slots = useSelector(state => state.daily_planner.slots)
  const [currentSlide, setCurrentSlide] = useState(0)
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

  // Planner back and forward button functionality
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
  console.log('CURRENT DAILY PLANNER --->', currentDailyPlanner)
  const dailyPlannerSlots = currentDailyPlanner.time_slots

  // Assigning to do to a time slot
  const handleSlotClick = slotId => {
    setSlotId(slotId)
    console.log('SLOT ID ---->', slotId)
    setIsCreateTodoModalOpen(true)
  }

  // const handleCreateTodo = async todoData => {
  //   try {
  //     console.log('TODO DATA ---->', todoData)
  //     const createdTodo = await dispatch(createNewTodo(todoData))
  //     console.log('CREATED TODO ---->', createdTodo)

  //     // Find the corresponding DailyPlannerSlot object
  //     const slotToUpdate = dailyPlannerSlots.find(slot => slot.id === slotId)
  //     console.log('SLOT TO UPDATE --->', slotToUpdate)
  //     if (slotToUpdate) {
  //       // Update the todo_id of the DailyPlannerSlot
  //       slotToUpdate.todo_id = createdTodo.id
  //       // Dispatch an action to update the DailyPlannerSlot in the database
  //       await dispatch(
  //         assignTodoToSlotThunk(
  //           currentDailyPlanner.id,
  //           slotToUpdate.id,
  //           createdTodo.id
  //         )
  //       )
  //     }

  //     setIsCreateTodoModalOpen(false)
  //   } catch (error) {
  //     console.error(error)
  //     // Handle error as needed
  //   }
  // }

  // const handleCloseModal = todoData => {
  //   setIsCreateTodoModalOpen(false)
  //   if (todoData) {
  //     handleCreateTodo(todoData)
  //   }
  // }

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
        <p>To Do | {currentDailyPlanner.date}</p>
        <div className='slideshow-controls'>
          <button onClick={goToPreviousSlide}>&lt;</button>
          <button onClick={goToNextSlide}>&gt;</button>
        </div>
      </div>
      <div className='time-slots-start-end'>
        {dailyPlannerSlots &&
          dailyPlannerSlots.map(slot => (
            <div className='time-slot' key={slot.id}>
              <p className='time'>
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </p>
              <input
                className='time-slot-field'
                type='text'
                value={slot.todo_id || ''}
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
