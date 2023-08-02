import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory } from 'react-router-dom'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk
} from '../../store/daily_planner'
import { updateExistingTodo, deleteExistingTodo } from '../../store/todos'
import { useModal } from '../../context/Modal'
import CreateTodoModal from '../ToDos/CreateTodoModal'
import UpdateTodoModal from '../ToDos/UpdateTodoModal'
import OpenModalButton from '../../components/OpenModalButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faPencil,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import './DailyPlanner.css'

function DailyPlanner () {
  const dailyPlanners = useSelector(state => state.daily_planner.dailyPlanner)
  const slots = useSelector(state => state.daily_planner.slots.slots)
  console.log('Slots ----->', slots)
  const [currentSlide, setCurrentSlide] = useState(
    getCurrentDailyPlannerIndex()
  )
  const [slotId, setSlotId] = useState('')
  const { closeModal } = useModal()
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

  // UPDATE TODO
  const handleUpdateTodo = async updatedTodoData => {
    try {
      const response = await dispatch(
        updateExistingTodo(slotId, updatedTodoData)
      )

      if (response.ok) {
        dispatch(fetchDailyPlannersThunk())
      } else {
        throw new Error('Failed to update TODO')
      }
    } catch (error) {
      console.error(error)
    }
  }

  // CHECKBOX CHANGE HANDLER
  const handleTodoCheckboxChange = async (todo, completed) => {
    try {
      const updatedTodoData = { completed: !completed }
      console.log('UPDATED TODO --->', updatedTodoData)

      const response = await dispatch(updateExistingTodo(todo, updatedTodoData))
      console.log(response)

      // if (response.ok) {
        dispatch(fetchDailyPlannersThunk())
      // } else {
      //   throw new Error('Failed to update TODO')
      // }
    } catch (error) {
      console.error(error)
    }
  }

  // DELETE TODO
  const handleDeleteTodo = async slotId => {
    try {
      const response = await dispatch(deleteExistingTodo(slotId))

      if (response.ok) {
        dispatch(fetchDailyPlannersThunk())
      } else {
        throw new Error('Failed to delete TODO')
      }
    } catch (error) {
      console.error(error)
    }
  }

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
  if (!dailyPlanners && !slots) {
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
              <input
                type='checkbox'
                checked={slot.todo && slot.todo.completed}
                onChange={() =>
                  handleTodoCheckboxChange(
                    slot.todo.id,
                    slot.todo && slot.todo.completed
                  )
                }
              />

              <OpenModalButton
                modalComponent={
                  <CreateTodoModal
                    slotId={slot.id}
                    plannerId={currentDailyPlanner.id}
                  />
                }
                buttonText={<FontAwesomeIcon icon={faPlus} />}
                handleSlotClick={handleSlotClick}
                slotId={slot.id}
              />
              {slot.todo && (
                <>
                  <OpenModalButton
                    modalComponent={
                      <UpdateTodoModal
                        todoId={slot.todo_id}
                        name={slot.todo.name}
                        priority={slot.todo.priority}
                        notes={slot.todo.notes}
                        reminder={slot.todo.reminder}
                        onSubmit={handleUpdateTodo}
                        onClose={() => setSlotId(null)}
                      />
                    }
                    buttonText={
                      <FontAwesomeIcon icon={faPencil} className='update' />
                    }
                    onModalClose={() => setSlotId(null)}
                  />
                  <button
                    onClick={() => handleDeleteTodo(slot.todo.id)}
                    className='delete-button'
                  >
                    {<FontAwesomeIcon icon={faTrash} className='delete' />}
                  </button>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default DailyPlanner
