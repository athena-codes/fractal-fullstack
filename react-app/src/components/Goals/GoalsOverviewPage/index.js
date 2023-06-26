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
  const { openModal, closeModal } = useModal()
  const [selectedGoalId, setSelectedGoalId] = useState(null)

  useEffect(() => {
    dispatch(fetchAllGoals())
  }, [dispatch])

  const handleDeleteGoal = async goalId => {
    try {
      await dispatch(deleteExistingGoal(goalId))
      // Optionally show a success message here
    } catch (error) {
      console.error(error)
      // Handle error as needed
    }
  }

  const handleUpdateGoal = goalId => {
    setSelectedGoalId(goalId)
    openModal()
  }

  const handleSubmitUpdateGoal = async updatedGoalData => {
    try {
      await dispatch(updateExistingGoal(selectedGoalId, updatedGoalData))
      closeModal()
      dispatch(fetchAllGoals()) // Refetch goals to update the list
    } catch (error) {
      console.error(error)
      // Handle error as needed
    }
  }

  return (
    <div>
      <h2>All Goals</h2>
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
                    onSubmit={handleSubmitUpdateGoal}
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
