import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useModal } from '../../context/Modal'
import { useHistory } from 'react-router-dom'
import { fetchAllGoals } from '../../store/goals'
import { fetchAllTodos } from '../../store/todos'
import {
  fetchAllReminders,
  updateExistingReminder,
  deleteExistingReminder
} from '../../store/reminders'
import CreateReminderModal from '../Reminders/CreateReminderModal'
import UpdateReminderModal from '../Reminders/UpdateReminderModal'
import OpenModalButton from '../../components/OpenModalButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSquarePlus,
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

import './DailyOverview.css'

function DailyOverview () {
  const dispatch = useDispatch()
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user)
  const goals = useSelector(state => state.goals.goals)
  const todos = useSelector(state => state.todos.todos)
  const remindersRedux = useSelector(state => state.reminders.reminders)
  const [selectedTodoId, setSelectedTodoId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { closeModal } = useModal()

  useEffect(() => {
    Promise.all([
      dispatch(fetchAllGoals()),
      dispatch(fetchAllTodos()),
      dispatch(fetchAllReminders())
    ])
      .then(() => {
        setIsLoaded(true)
      })
      .catch(error => {
        console.error(error)
        setIsLoaded(true)
      })
  }, [dispatch])

  // TODAY'S DATE
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // UPDATING TIME
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  // FORMAT PROGRESS PERCENTAGE
  function formatProgress (progress) {
    const formattedProgress = parseFloat(progress).toFixed(2)
    return formattedProgress.endsWith('.00')
      ? parseInt(formattedProgress)
      : formattedProgress
  }

  const formatTime = timeString => {
    const date = new Date(`2000-01-01T${timeString}`)
    return date.toLocaleTimeString([], { hour: 'numeric' })
  }

  const handleUpdateReminder = async updatedReminderData => {
    try {
      window.location.reload()
      const response = await dispatch(
        updateExistingReminder(selectedTodoId, updatedReminderData)
      )

      if (response.ok) {
        dispatch(fetchAllReminders())
      } else {
        throw new Error('Failed to update Reminder')
      }
      closeModal()
      // history.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteReminder = async reminderId => {
    try {
      await dispatch(deleteExistingReminder(reminderId))
      await dispatch(fetchAllReminders())
    } catch (error) {
      console.error(error)
    }
  }

  // if (!remindersRedux) {
  //   return <div>Loading...</div>
  // }

  return (
    <>
      {isLoaded && (
        <>
          {sessionUser && (
            <div className='daily-overview'>
              <div className='daily-overview-heading-date'>
                <h1 className='daily-overview-heading'>Daily Overview</h1>
                <div className='daily-overview-date-time'>

                <p className='current-date'>{currentDate}</p>
                <p className='current-time'>
                  {currentTime.toLocaleTimeString()}
                </p>
                </div>
              </div>

              <div className='goals-section-overview'>
                <div className='goals-header-overview'>
                  <h2 className='goals-title-overview'>Goal Progress</h2>
                  <Link to='/goals' className='see-all-link'>
                    See All
                  </Link>
                </div>
                {goals.length === 0 ? (
                  <p className='no-goals-message'>No goals yet!</p>
                ) : (
                  <ul className='goal-list-overview'>
                    {goals.map(goal => (
                      <li className='goal-progress-section' key={goal.id}>
                        <div className='goal-name'>{goal.title}</div>
                        <div className='progress-bar'>
                          <div
                            className='progress-bar-fill'
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                        {formatProgress(goal.progress)}%
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {isLoaded && (
                <>
                  <div className='reminders-section'>
                    <div className='reminder-header-overview'>
                      <div className='reminder-title-button'>
                        <h2 className='reminders-title'>Reminders</h2>

                        <div className='new-reminder-button'>
                          <OpenModalButton
                            modalComponent={<CreateReminderModal />}
                            buttonText={<FontAwesomeIcon icon={faSquarePlus} />}
                          />
                        </div>
                      </div>
                      <Link to='/daily-planner' className='see-all-link'>
                        See All
                      </Link>
                    </div>
                    {isLoaded && (
                      <div className='reminders-list'>
                        {remindersRedux.length === 0 ? (
                          <p className='no-reminders-message'>
                            No reminders yet!
                          </p>
                        ) : (
                          remindersRedux.reminders !== undefined &&
                          remindersRedux.reminders.map(reminder => (
                            <div className='reminder-card' key={reminder.id}>
                              <div className='reminder-content'>
                                <p className='reminder-name'>
                                  {reminder.todo.name}
                                </p>
                              </div>
                              <div className='reminder-actions'>
                                <OpenModalButton
                                  modalComponent={
                                    <UpdateReminderModal
                                      reminderId={reminder.id}
                                      currentTodoId={reminder.todo_id}
                                      onSubmit={handleUpdateReminder}
                                    />
                                  }
                                  buttonText={
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                  }
                                />
                                <button
                                  className='delete-button'
                                  onClick={() =>
                                    handleDeleteReminder(reminder.id)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className='delete'
                                  />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className='coming-soon-section'>
                <h2>Coming Soon!</h2>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DailyOverview
