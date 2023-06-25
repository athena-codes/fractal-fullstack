import React, { useState } from 'react'
import { useModal } from '../../../context/Modal'

const CreateGoalPage = () => {
  const { closeModal } = useModal()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timeframe, setTimeframe] = useState('')

  const handleSubmit = e => {
    e.preventDefault()

    // Perform the form submission logic here
    // You can use the title, description, endDate, and timeframe values

    // Close the modal after form submission
    closeModal()
  }

  return (
        <h2>Goals</h2>
  )
}

export default CreateGoalPage
