import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from '../../../context/Modal'
import { createNewReminder } from '../../../store/reminders'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const CreateReminderModal = () => {
  const dispatch = useDispatch()
  const [todoId, setTodoId] = useState('')
  const [errors, setErrors] = useState({})
  const todos = useSelector(state => state.todos.todos)
  const { closeModal } = useModal()

  const handleSubmit = async e => {
    e.preventDefault()

    const errors = {}

    if (!todoId) {
      errors.todoId = 'Please select a todo for the reminder!'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    const reminderData = {
      todo_id: parseInt(todoId)
    }

    dispatch(createNewReminder(reminderData))
    closeModal()
  }

  const handleTodoChange = e => {
    const selectedTodoId = e.target.value
    setTodoId(selectedTodoId)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Add a Reminder</h2>

        {errors.todoId && <p className='error-message'>{errors.todoId}</p>}
        <div className='new-reminder-input-label'>
          <label className='label-new-reminder'>
            Select a todo to set a reminder for
          </label>
          <select name='todoId' value={todoId} onChange={handleTodoChange}>
            <option value=''>Select Todo</option>
            {todos.map(todo => (
              <option
                key={todo.id}
                value={todo.id}
                className='input-create-reminder-todo'
              >
                {todo.name}
              </option>
            ))}
          </select>
        </div>
      </form>
      <div  className='reminder-submit'>
      <button className='reminders-submit-button' type='submit'>
        Create Reminder
      </button>
      </div>
    </>
  )
}

export default CreateReminderModal
