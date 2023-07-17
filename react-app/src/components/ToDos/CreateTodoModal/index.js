import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { createNewTodo } from '../../../store/todos'
import {
  assignTodoToSlotThunk,
  fetchDailyPlannersThunk
} from '../../../store/daily_planner'

import './CreateTodoModal.css'

const CreateTodoModal = ({ slotId, plannerId }) => {
  const [name, setName] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [reminder, setReminder] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [goalId, setGoalId] = useState('')
  const [errors, setErrors] = useState({})

  const { closeModal } = useModal()
  const dispatch = useDispatch()
  const history = useHistory()

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
      reminder,
      completed,
      goal_id: goalId ? goalId : null
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
        {errors.priority && <p className='error-message-todo'>{errors.priority}</p>}
      </div>

      <div>
        <label>Notes:</label>
        <textarea
          name='notes'
          value={notes}
          onChange={e => setNotes(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label>Reminder:</label>
        <input
          name='reminder'
          type='checkbox'
          checked={reminder}
          onChange={handleReminderChange}
        />
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
