import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { createNewTodo } from '../../../store/todos'
import { assignTodoToSlotThunk } from '../../../store/daily_planner'

const CreateTodoModal = ({ onClose, slotId, plannerId }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { closeModal } = useModal()

  const [name, setName] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [reminder, setReminder] = useState('')
  const [completed, setCompleted] = useState(false)
  const [goalId, setGoalId] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    const todoData = {
      name,
      priority,
      description,
      notes,
      reminder: reminder || false,
      completed: completed || false,
      goal_id: goalId
    }

    console.log('SLOT ID ---->', slotId)
    console.log('PLANNER ID ---->', plannerId)
    const newTodo = await dispatch(createNewTodo(todoData))

    if (newTodo) {
      await dispatch(assignTodoToSlotThunk(plannerId, slotId, newTodo.id))
    }

    closeModal()
  }

  const handleReminderChange = e => {
    const isChecked = e.target.checked
    setReminder(isChecked ? true : false)
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
          required
        />
      </div>

      <div>
        <label>Priority:</label>
        <select
          name='priority'
          value={priority}
          onChange={e => setPriority(e.target.value)}
          required
        >
          <option value=''>Select Priority</option>
          <option value='1'>Low</option>
          <option value='2'>Medium</option>
          <option value='3'>High</option>
        </select>
      </div>

      <div>
        <label>Description:</label>
        <textarea
          name='description'
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>
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
        <label>Completed:</label>
        <input
          name='completed'
          type='checkbox'
          checked={completed}
          onChange={e => setCompleted(e.target.checked)}
        />
      </div>

      <div>
        <label>Goal ID:</label>
        <input
          name='goal_id'
          type='text'
          value={goalId}
          onChange={e => setGoalId(e.target.value)}
        />
      </div>

      <div>
        <button type='submit'>Create</button>
      </div>
    </form>
  )
}

export default CreateTodoModal
