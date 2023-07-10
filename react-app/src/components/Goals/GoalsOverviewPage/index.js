import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllGoals, deleteExistingGoal } from '../../../store/goals'
import { useModal } from '../../../context/Modal'
import { updateExistingGoal } from '../../../store/goals'
import UpdateGoalModal from '../UpdateGoalModal'
import OpenModalButton from '../../OpenModalButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faHourglass,
  faBullseye,
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

import './GoalsOverviewPage.css'

const GoalsOverview = () => {
  const dispatch = useDispatch()
  const goals = useSelector(state => state.goals.goals)
  const { closeModal } = useModal()
  const [selectedGoalId, setSelectedGoalId] = useState(null)

  useEffect(() => {
    dispatch(fetchAllGoals())
  }, [dispatch])

  // HANDLE DELETE GOAL
  const handleDeleteGoal = async goalId => {
    try {
      await dispatch(deleteExistingGoal(goalId))
    } catch (error) {
      console.error(error)
    }
  }

  // HANDLE UPDATE GOAL
  const handleUpdateGoal = async updatedGoalData => {
    try {
      await dispatch(updateExistingGoal(selectedGoalId, updatedGoalData))
      closeModal()
      dispatch(fetchAllGoals())
    } catch (error) {
      console.error(error)
    }
  }

  // FORMAT DATE
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
  ;<FontAwesomeIcon icon={faClock} />
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

  // LOADING SYMBOL
  if (!goals) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>Goals</h2>
      <div className='goals-overview'>
        {goals.length === 0 ? (
          <p>No goals found.</p>
        ) : (
          <ul className='goals-list'>
            {goals.map(goal => (
              <li key={goal.id} className='goal-card'>
                <h3 className='title'>
                  {' '}
                  {<FontAwesomeIcon icon={faBullseye} className='bullseye' />}
                  {goal.title}
                </h3>
                <p className='description'> -{goal.description}</p>
                <p>
                  {<FontAwesomeIcon icon={faClock} className='clock' />}
                  {formatDate(goal.end_date)}
                </p>
                <p className='timeframe-clock'>
                  {<FontAwesomeIcon icon={faHourglass} className='hourglass' />}
                  {goal.timeframe} days
                </p>
                <div className='goal-actions'>
                  <div className='modal-btn-goal'>
                    <OpenModalButton
                      modalComponent={
                        <UpdateGoalModal
                          goalId={goal.id}
                          title={goal.title}
                          description={goal.description}
                          endDate={goal.end_date}
                          timeframe={goal.timeframe}
                          onSubmit={handleUpdateGoal}
                          onClose={() => setSelectedGoalId(null)}
                        />
                      }
                      buttonText={
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className='update'
                        />
                      }
                      onModalClose={() => setSelectedGoalId(null)}
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className='delete-button'
                  >
                    {<FontAwesomeIcon icon={faTrash} className='delete' />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default GoalsOverview
