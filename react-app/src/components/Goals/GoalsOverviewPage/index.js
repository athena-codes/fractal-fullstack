import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllGoals } from '../../../store/goals'

const GoalsOverview = () => {
  const dispatch = useDispatch()
  const goals = useSelector(state => state.goals.goals)

  useEffect(() => {
    dispatch(fetchAllGoals())
  }, [dispatch])

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
              <p>{goal.description}</p>
              <p>End Date: {goal.end_date}</p>
              <p>Timeframe: {goal.timeframe}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GoalsOverview
