import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateExistingTodo } from '../../../store/todos'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk
} from '../../../store/daily_planner'
import { useModal } from '../../../context/Modal'

import '../CreateTodoModal/CreateTodoModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const UpdateTodoModal = ({ todoId, name, priority, notes, reminder }) => {
  const [updatedName, setUpdatedName] = useState(name)
  const [updatedPriority, setUpdatedPriority] = useState(priority)
  const [updatedNotes, setUpdatedNotes] = useState(notes)
  const [updatedReminder, setUpdatedReminder] = useState(reminder)
  const [errors, setErrors] = useState({})
  //   const [description, setDescription] = useState(initialData.description)
  //   const [completed, setCompleted] = useState(initialData.completed)
  //   const [goalId, setGoalId] = useState(initialData.goal_id)
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleSubmit = async e => {
    e.preventDefault()

    const errors = {}

    if (!updatedName) {
      errors.name = 'Please provide a name for your to-do!'
    }

    if (!updatedPriority) {
      errors.priority = 'Please specify to-do priority!'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    const updatedTodoData = {
      name: updatedName,
      priority: updatedPriority,
      notes: updatedNotes,
      reminder: updatedReminder
    }

    try {
      dispatch(updateExistingTodo(todoId, updatedTodoData))
      closeModal()
      await dispatch(fetchDailyPlannersThunk())
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Todo</h2>
      {errors.name && <p className='error-message-todo'>{errors.name}</p>}

      <div className='new-todo-input-label'>
        <label className='label-new-todo'>Name</label>
        <input
          name='name'
          type='text'
          value={updatedName}
          onChange={e => setUpdatedName(e.target.value)}
          className='input-create-todo-name'
        />
      </div>
      {errors.priority && (
        <p className='error-message-todo'>{errors.priority}</p>
      )}

      <div className='new-todo-input-label'>
        <label className='label-new-todo'>Priority</label>
        <select
          name='priority'
          value={updatedPriority}
          onChange={e => setUpdatedPriority(e.target.value)}
          className='input-create-todo-priority'
        >
          <option value=''>Select Priority</option>
          <option value='1'>Low</option>
          <option value='2'>Medium</option>
          <option value='3'>High</option>
        </select>
      </div>

      {/* <div>
        <label>Description:</label>
        <textarea
          name='description'
          value={description}
          onChange={e => se(e.target.value)}
        ></textarea>
      </div> */}

      <div className='new-todo-input-label'>
        <label className='label-new-todo'>Notes</label>
        <textarea
          name='notes'
          value={updatedNotes}
          onChange={e => setUpdatedNotes(e.target.value)}
          className='input-create-todo-notes'
        ></textarea>
      </div>

      {/* <div>
        <label>Reminder:</label>
        <input
          name='reminder'
          type='checkbox'
          checked={updatedReminder}
          onChange={e => setUpdatedReminder(e.target.checked)}
        />
      </div> */}

      {/* <div>
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
      </div> */}

      <div>
        <button className='todo-submit-btn' type='submit'>
          {
            <FontAwesomeIcon
              icon={faPaperPlane}
              className='submit-paper-plane'
            />
          }
        </button>
      </div>
    </form>
  )
}

export default UpdateTodoModal
