import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../../context/Modal'
import {
  updateExistingReminder,
  fetchAllReminders
} from '../../../store/reminders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import './UpdateReminder.css'

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
      await dispatch(fetchAllReminders())
      // window.location.reload()
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
        <div className='update-reminder-input-label'>
          <label className='label-update-reminder' htmlFor='todoId'>
            Select a todo to set a reminder for
          </label>
          <select
            name='todoId'
            value={updatedTodoId}
            onChange={handleTodoChange}
          >
            <option value=''>Select Todo</option>
            {todos.map(todo => (
              <option
                className='input-update-reminder'
                key={todo.id}
                value={todo.id}
              >
                {todo.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button className='note-submit-btn' type='submit'>
            <FontAwesomeIcon
              icon={faPaperPlane}
              className='submit-paper-plane'
            />
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateReminderModal
