import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateExistingGoal } from '../../../store/goals'
import { useModal } from '../../../context/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const UpdateGoalModal = ({
  title,
  description,
  endDate,
  timeframe,
  goalId
}) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const [updatedTitle, setUpdatedTitle] = useState(title)
  const [updatedDescription, setUpdatedDescription] = useState(description)
  const [updatedEndDate, setUpdatedEndDate] = useState(
    new Date(endDate).toISOString().split('T')[0]
  )
  console.log('UPDATED END DATE', updatedEndDate)
  const [updatedTimeframe, setUpdatedTimeframe] = useState(timeframe)
  const [errors, setErrors] = useState({})

  // HANDLE FORM SUBMISSTION
  const handleSubmit = async e => {
    e.preventDefault()

    const errors = {}

    if (!updatedTitle) {
      errors.title = 'Please provide a title for your goal!'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    const formattedEndDate = new Date(updatedEndDate).toISOString().split('T')[0]


    const updatedGoalData = {
      title: updatedTitle,
      description: updatedDescription,
      end_date: formattedEndDate,
      timeframe: parseInt(updatedTimeframe)
    }

    try {
      await dispatch(updateExistingGoal(goalId, updatedGoalData))
      closeModal()
    } catch (error) {
      console.error(error)
    }
  }

  // HANDLE END DATE CHANGE + SET TIMEFRAME
  const handleEndDateChange = e => {
    const selectedEndDate = e.target.value
    console.log('SELECTED END DATE', selectedEndDate)
    setUpdatedEndDate(selectedEndDate)

    const today = new Date().setHours(0, 0, 0, 0)
    const selectedDate = new Date(selectedEndDate).setHours(0, 0, 0, 0)
    const differenceInTime = selectedDate - today
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))

    if (differenceInDays >= 0) {
      setUpdatedTimeframe(differenceInDays.toString() + ' days')
    }
  }

  return (
    <div>
      <h2>Update Goal</h2>
      <form onSubmit={handleSubmit}>
        {errors.title && <p className='error-message-goal'>{errors.title}</p>}

        <div className='new-goal-input-label'>
          <label htmlFor='title' className='label-new-goal'>
            Title
          </label>
          <div className='error-message-div'>
            <input
              type='text'
              id='title'
              value={updatedTitle}
              onChange={e => setUpdatedTitle(e.target.value)}
              className='input-create-goal-title'
            />
          </div>
        </div>

        <div className='new-goal-input-label'>
          <label htmlFor='endDate' className='label-new-goal'>
            End Date
          </label>
          <div className='error-message-div'>
            <input
              type='date'
              id='endDate'
              value={updatedEndDate}
              onChange={handleEndDateChange}
              className='input-create-goal-end-date'
            />
          </div>
        </div>

        <div className='new-goal-input-label'>
          <label htmlFor='timeframe' className='label-new-goal'>
            Timeframe (days)
          </label>
          <input
            type='text'
            id='timeframe'
            value={updatedTimeframe}
            readOnly
            className='input-create-goal-timeframe'
          />
        </div>
        <div className='new-goal-input-label'>
          <label htmlFor='description' className='label-new-goal'>
            Description
          </label>
          <textarea
            id='description'
            value={updatedDescription}
            onChange={e => setUpdatedDescription(e.target.value)}
            className='input-create-goal-description'
          ></textarea>
        </div>

        <button type='submit' className='goal-submit-btn'>
          {
            <FontAwesomeIcon
              icon={faPaperPlane}
              className='submit-paper-plane'
            />
          }
        </button>
      </form>
    </div>
  )
}

export default UpdateGoalModal
