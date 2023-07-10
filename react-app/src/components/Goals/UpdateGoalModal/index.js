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
  const [updatedEndDate, setUpdatedEndDate] = useState(
    new Date(endDate).toISOString().split('T')[0]
  )
  const [updatedTimeframe, setUpdatedTimeframe] = useState(timeframe)

  // HANDLE FORM SUBMISSTION
  const handleSubmit = async e => {
    e.preventDefault()

    const updatedGoalData = {
      title: updatedTitle,
      description: updatedDescription,
      end_date: updatedEndDate,
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
          onChange={handleEndDateChange}
        />

        <label htmlFor='timeframe'>Timeframe (days)</label>
        <input type='text' id='timeframe' value={updatedTimeframe} readOnly />

        <button type='submit'>Save</button>
        <button type='button' onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  )
}


export default UpdateGoalModal;
