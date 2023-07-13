import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAllGoals } from '../../store/goals'
import { fetchAllTodos } from '../../store/todos'

import './DailyOverview.css'

function DailyOverview () {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const goals = useSelector(state => state.goals.goals)
  const todos = useSelector(state => state.todos.todos)
  const reminderTodos = todos.filter(todo => todo.reminder)
  console.log('GOALS --->', goals)

  useEffect(() => {
    dispatch(fetchAllGoals())
    dispatch(fetchAllTodos())
  }, [dispatch])

  // FORMAT PROGRESS PERCENTAGE
  function formatProgress (progress) {
  const formattedProgress = parseFloat(progress).toFixed(2)
  return formattedProgress.endsWith('.00')
    ? parseInt(formattedProgress)
    : formattedProgress
}


  return (
    <>
      {sessionUser && (
        <div className='daily-overview'>
          <h1>Daily Overview</h1>
          <div className='goals-section-overview'>
            <div className='goals-header-overview'>
              <h2 className='goals-title-overview'>Goal Progress</h2>
              <Link to='/goals' className='see-all-link'>
                See All
              </Link>
            </div>
            <ul className='goal-list-overview'>
              {goals.map(goal => (
                <li className='goal-progress-section' key={goal.id}>
                  <div className='goal-name'>{goal.title}</div>
                  <div className='progress-bar'>
                    <div
                      className='progress-bar-fill'
                      style={{ width: `${goal.progress}%` }}
                    >
                      {goal.progress}
                    </div>
                  </div>
                  {formatProgress(goal.progress)}%
                </li>
              ))}
            </ul>
          </div>
          <div className='reminders-section'>
            <h2>Reminders</h2>
            <ul className='reminders-list'>
              {reminderTodos.map(todo => (
                <li className='reminders-list-item' key={todo.id}>{todo.name}</li>
              ))}
            </ul>
          </div>
          <div className='coming-soon-section'>
            <h2>Coming Soon!</h2>
          </div>
        </div>
      )}
    </>
  )
}

export default DailyOverview
