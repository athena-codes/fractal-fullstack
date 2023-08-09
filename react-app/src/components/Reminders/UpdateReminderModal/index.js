import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../../context/Modal'
import { updateExistingReminder, fetchAllReminders } from '../../../store/reminders'

const UpdateReminderModal = ({ reminderId, currentTodoId }) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const todos = useSelector(state => state.todos.todos)

  const [updatedTodoId, setUpdatedTodoId] = useState(currentTodoId)

  const handleSubmit = async e => {
    e.preventDefault()

    const updatedReminderData = {
      todo_id: parseInt(updatedTodoId)
    }

    try {
      await dispatch(updateExistingReminder(reminderId, updatedReminderData))
      closeModal()

    } catch (error) {
      console.error(error)
    }
  }

  const handleTodoChange = e => {
    const selectedTodoId = e.target.value
    setUpdatedTodoId(selectedTodoId)
  }

  return (
    <div>
      <h2>Update Reminder</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='todoId'>Todo:</label>
        <select name='todoId' value={updatedTodoId} onChange={handleTodoChange}>
          <option value=''>Select Todo</option>
          {todos.map(todo => (
            <option key={todo.id} value={todo.id}>
              {todo.name}
            </option>
          ))}
        </select>

        <button type='submit'>Save</button>
        <button type='button' onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  )
}

export default UpdateReminderModal
