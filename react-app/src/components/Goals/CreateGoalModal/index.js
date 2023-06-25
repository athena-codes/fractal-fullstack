import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { createNewGoal } from '../../../store/goals'

const CreateGoalModal = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { closeModal } = useModal()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeframe, setTimeframe] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    const formattedEndDate = new Date(endDate).toISOString().split('T')[0]

    const formattedTimeframe = parseInt(timeframe)

    const goalData = {
      title,
      description,
      end_date: formattedEndDate,
      timeframe: formattedTimeframe
    }
    console.log('GOAL DATA --->', goalData)
    console.log(typeof formattedEndDate)
    console.log(typeof formattedTimeframe)

    dispatch(createNewGoal(goalData))
    closeModal()
    history.push('/goals')
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
          required
        />
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
          onChange={e => setEndDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Timeframe:</label>
        <input
          name='timeframe'
          type='text'
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          required
        />
      </div>

      <div>
        <button type='submit'>Create</button>
        <button type='button' onClick={closeModal}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CreateGoalModal
