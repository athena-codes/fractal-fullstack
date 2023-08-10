import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { createNewTodo } from '../../../store/todos'
import { fetchAllGoals } from '../../../store/goals'
import {
  assignTodoToSlotThunk,
  fetchDailyPlannersThunk
} from '../../../store/daily_planner'

import './CreateTodoModal.css'

const CreateTodoModal = ({ slotId, plannerId }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { closeModal } = useModal()
  const [name, setName] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [reminder, setReminder] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [goalId, setGoalId] = useState('')
  console.log('GOAL ID --->', goalId)
  const [errors, setErrors] = useState({})
  const [goals, setGoals] = useState([])
  const allGoals = useSelector(state => state.goals.goals)

  // Fetch the list of goals from the backend using the thunk
  useEffect(() => {
    dispatch(fetchAllGoals())
  }, [dispatch])

  // Update the local state with the goals fetched from the Redux store
  useEffect(() => {
    if (allGoals) {
      setGoals(allGoals)
    }
  }, [allGoals])

  // HANDLE FORM SUBMISSION
  const handleSubmit = async e => {
    e.preventDefault()

    const errors = {}

    if (!name) {
      errors.name = 'Please provide a name for your to-do!'
    }

    if (!priority) {
      errors.priority = 'Please specify to-do priority!'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    const todoData = {
      name,
      priority: parseInt(priority),
      description,
      notes,
      // reminder,
      completed,
      goal_id: goalId ? parseInt(goalId) : null
    }

    const newTodo = await dispatch(createNewTodo(todoData))

    if (newTodo) {
      await dispatch(assignTodoToSlotThunk(plannerId, slotId, newTodo.id))
    }

    dispatch(fetchDailyPlannersThunk())

    closeModal()
  }

  const handleReminderChange = e => {
    const isChecked = e.target.checked
    setReminder(isChecked)
  }

  const handleGoalChange = e => {
    const selectedGoalId = e.target.value
    setGoalId(parseInt(selectedGoalId))

    if (!selectedGoalId) {
      setGoalId(null)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Todo</h2>

      <div>
        <label>Name:</label>
        <input
          name='name'
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors.name && <p className='error-message-todo'>{errors.name}</p>}
      </div>

      <div>
        <label>Priority:</label>
        <select
          name='priority'
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value=''>Select Priority</option>
          <option value='1'>Low</option>
          <option value='2'>Medium</option>
          <option value='3'>High</option>
        </select>
        {errors.priority && (
          <p className='error-message-todo'>{errors.priority}</p>
        )}
      </div>

      <div>
        <label>Notes:</label>
        <textarea
          name='notes'
          value={notes}
          onChange={e => setNotes(e.target.value)}
        ></textarea>
      </div>

      {/* <div>
        <label>Reminder:</label>
        <input
          name='reminder'
          type='checkbox'
          checked={reminder}
          onChange={handleReminderChange}
        />
      </div> */}
      <div>
        <label>Goal:</label>
        <select name='goal_id' value={goalId} onChange={handleGoalChange}>
          <option value={''}>Select Goal</option>
          {/* Map over the goals and render each goal as an option */}
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
        {/* Add any error handling for the goal dropdown if needed */}
      </div>

      <div>
        <button type='submit'>Create</button>
      </div>
    </form>
  )
}

export default CreateTodoModal

// {
//   /*  COMPLETED AND GOAL ID INPUT FIELDS */
// }
// {
//   /* <div>
//         <label>Completed:</label>
//         <input
//           name='completed'
//           type='checkbox'
//           checked={completed}
//           onChange={e => setCompleted(e.target.checked)}
//         />
//       </div> */
// }

// {
//   /* <div>
//         <label>Goal ID:</label>
//         <input
//           name='goal_id'
//           type='text'
//           value={goalId}
//           onChange={e => setGoalId(e.target.value)}
//         />
//       </div> */
// }

// DESCRIPTION
// {
//   /* <div>
//         <label>Description:</label>
//         <textarea
//           name='description'
//           value={description}
//           onChange={e => setDescription(e.target.value)}
//         ></textarea>
//       </div> */
// }
