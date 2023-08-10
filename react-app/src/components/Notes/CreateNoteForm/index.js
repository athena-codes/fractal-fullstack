import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createNewNote } from '../../../store/notes'

import './CreateNoteForm.css'

function CreateNoteForm () {
  const dispatch = useDispatch()
  const history = useHistory()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState([])

  const handleSubmit = async e => {
    e.preventDefault()
    const noteData = {
        title: title,
        content: content
    }

    const data = await dispatch(createNewNote(noteData))

    if (data && data.errors) {
      setErrors(data.errors)
    } else {
      history.push('/notes')
      // Handle successful submission or redirection
    }
  }

  return (
    <div className='create-note-form'>
      <h1 className='new-note-heading'>Create a New Note</h1>
      <form onSubmit={handleSubmit}>
        <ul className='note-form-errors'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          <input
          className='title-input-notes'
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Note Title'
          />
        </label>
        <label>
          <textarea
          className = 'content-input-notes'
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='Write your note here!'
          />
        </label>
        <button className='notes-submit-button' type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default CreateNoteForm
