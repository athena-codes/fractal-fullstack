import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateExistingGoal } from '../../../store/goals'
import { useModal } from '../../../context/Modal'

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
  const [updatedEndDate, setUpdatedEndDate] = useState(endDate)
  const [updatedTimeframe, setUpdatedTimeframe] = useState(timeframe)

  const handleFormSubmit = async e => {
    e.preventDefault()

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
      // Handle error as needed
    }
  }

  return (
    <div>
      <h2>Update Goal</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          id='title'
          value={updatedTitle}
          onChange={e => setUpdatedTitle(e.target.value)}
        />

        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          value={updatedDescription}
          onChange={e => setUpdatedDescription(e.target.value)}
        ></textarea>

        <label htmlFor='endDate'>End Date</label>
        <input
          type='date'
          id='endDate'
          value={updatedEndDate}
          onChange={e => setUpdatedEndDate(e.target.value)}
        />

        <label htmlFor='timeframe'>Timeframe (days)</label>
        <input
          type='number'
          id='timeframe'
          value={updatedTimeframe}
          onChange={e => setUpdatedTimeframe(e.target.value)}
        />

        <button type='submit'>Save</button>
        <button type='button' onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  )
}

export default UpdateGoalModal
