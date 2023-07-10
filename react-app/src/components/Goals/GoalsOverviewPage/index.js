import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllGoals, deleteExistingGoal } from '../../../store/goals'
import { useModal } from '../../../context/Modal'
import { updateExistingGoal } from '../../../store/goals'
import UpdateGoalModal from '../UpdateGoalModal'
import OpenModalButton from '../../OpenModalButton'

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

  // LOADING SYMBOL
  if (!goals) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>Goals</h2>
      {goals.length === 0 ? (
        <p>No goals found.</p>
      ) : (
        <ul>
          {goals.map(goal => (
            <li key={goal.id}>
              <h3>{goal.title}</h3>
              <p>Description: {goal.description}</p>
              <p>End Date: {goal.end_date}</p>
              <p>Timeframe: {goal.timeframe} days</p>
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
                buttonText='Update'
                onModalClose={() => setSelectedGoalId(null)}
              />
              <button onClick={() => handleDeleteGoal(goal.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GoalsOverview
