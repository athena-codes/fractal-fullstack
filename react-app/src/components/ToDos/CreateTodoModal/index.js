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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'


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
      <h2>Add a New Todo</h2>

      <div className='new-todo-input-label'>
        <label className='label-new-todo'>Name</label>
        <input
          name='name'
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Name'
          className='input-create-todo-name'
        />
        {errors.name && <p className='error-message-todo'>{errors.name}</p>}
      </div>

      <div className = 'new-todo-input-label'>
        <label className = 'label-new-todo'>Priority</label>
        <select
          name='priority'
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className = 'input-create-todo-priority'
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

      <div className = 'new-todo-input-label'>
        <label className = 'label-new-todo'>Notes</label>
        <textarea
          name='notes'
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className = 'input-create-todo-notes'
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
      <div className = 'new-todo-input-label'>
        <label className = 'label-new-todo'>Goal</label>
        <select
        name='goal_id'
        value={goalId}
        onChange={handleGoalChange}
        className = 'input-create-todo-goal'>
          <option value={''} >Select Goal</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </div>

      <div>
       <button className='todo-submit-btn' type='submit'>
  {<FontAwesomeIcon icon={faPaperPlane} className='submit-paper-plane' />}
</button>

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
