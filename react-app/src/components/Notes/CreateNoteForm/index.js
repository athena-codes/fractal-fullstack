import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNewNote } from '../../../store/notes'

function CreateNoteForm () {
  const dispatch = useDispatch()
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
      // Handle successful submission or redirection
    }
  }

  return (
    <div className='create-note-form'>
      <h1>Create a New Note</h1>
      <form onSubmit={handleSubmit}>
        <ul className='note-form-errors'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Title
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label>
          Content
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </label>
        <button type='submit'>Create Note</button>
      </form>
    </div>
  )
}

export default CreateNoteForm
