import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllGoals, deleteExistingGoal } from '../../../store/goals'

const GoalsOverview = () => {
  const dispatch = useDispatch()
  const goals = useSelector(state => state.goals.goals)

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
              <button onClick={() => handleDeleteGoal(goal.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GoalsOverview
