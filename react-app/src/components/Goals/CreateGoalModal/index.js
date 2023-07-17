import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { createNewGoal } from '../../../store/goals'

import './CreateGoalModal.css'

const CreateGoalModal = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { closeModal } = useModal()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [errors, setErrors] = useState({})

  // HANDLE FORM SUBMISSION
  const handleSubmit = async e => {
    e.preventDefault()

    const errors = {}

    if (!title) {
      errors.title = 'Please provide a title for your goal!'
    }

    if (!endDate) {
      errors.endDate = 'Please provide an end date for your goal!'
    } else {
      const today = new Date().setHours(0, 0, 0, 0)
      const selectedDate = new Date(endDate).setHours(0, 0, 0, 0)

      if (selectedDate <= today) {
        errors.endDate = 'End date must be a future date!'
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    const formattedEndDate = new Date(endDate).toISOString().split('T')[0]

    const goalData = {
      title,
      description,
      end_date: formattedEndDate,
      timeframe: parseInt(timeframe)
    }

    dispatch(createNewGoal(goalData))
    closeModal()
    history.push('/goals')
  }

  // FORMAT END DATE + SET TIMEFRAME
  const handleEndDateChange = e => {
    const selectedEndDate = e.target.value
    setEndDate(selectedEndDate)

    const today = new Date().setHours(0, 0, 0, 0)
    const selectedDate = new Date(selectedEndDate).setHours(0, 0, 0, 0)
    const differenceInTime = selectedDate - today
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))

    if (differenceInDays >= 0) {
      setTimeframe(differenceInDays.toString() + ' days')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Goal</h2>

      <div>
        <label>Title:</label>
        <input
          name='title'
          type='text'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {errors.title && <p className='error-message-goal'>{errors.title}</p>}
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
        <label>End Date:</label>
        <input
          name='end_date'
          type='date'
          value={endDate}
          onChange={handleEndDateChange}
        />
        {errors.endDate && (
          <p className='error-message-goal'>{errors.endDate}</p>
        )}
      </div>

      <div>
        <label>Timeframe:</label>
        <input name='timeframe' type='text' value={timeframe} readOnly />
      </div>

      <div className='submit-cancel-btns'>
        <button className='goal-submit-btn' type='submit'>
          Create
        </button>
        <button className='goal-cancel-btn' type='button' onClick={closeModal}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CreateGoalModal
