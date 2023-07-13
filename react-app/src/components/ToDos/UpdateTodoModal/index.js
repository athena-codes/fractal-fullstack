import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateExistingTodo } from '../../../store/todos'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk
} from '../../../store/daily_planner'
import { useModal } from '../../../context/Modal'

const UpdateTodoModal = ({ todoId, name, priority, notes, reminder }) => {
  const [updatedName, setUpdatedName] = useState(name)
  const [updatedPriority, setUpdatedPriority] = useState(priority)
  const [updatedNotes, setUpdatedNotes] = useState(notes)
  const [updatedReminder, setUpdatedReminder] = useState(reminder)
  //   const [description, setDescription] = useState(initialData.description)
  //   const [completed, setCompleted] = useState(initialData.completed)
  //   const [goalId, setGoalId] = useState(initialData.goal_id)
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleSubmit = async e => {
    e.preventDefault()

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

      <div>
        <label>Name:</label>
        <input
          name='name'
          type='text'
          value={updatedName}
          onChange={e => setUpdatedName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Priority:</label>
        <select
          name='priority'
          value={updatedPriority}
          onChange={e => setUpdatedPriority(e.target.value)}
          required
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

      <div>
        <label>Notes:</label>
        <textarea
          name='notes'
          value={updatedNotes}
          onChange={e => setUpdatedNotes(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label>Reminder:</label>
        <input
          name='reminder'
          type='checkbox'
          checked={updatedReminder}
          onChange={e => setUpdatedReminder(e.target.checked)}
        />
      </div>

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
        <button type='submit'>Update</button>
      </div>
    </form>
  )
}

export default UpdateTodoModal
