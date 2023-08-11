import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createNewNote } from '../../../store/notes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import './CreateNoteForm.css'

function CreateNoteForm () {
  const dispatch = useDispatch()
  const history = useHistory()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState([])

  const handleSubmit = async e => {
    e.preventDefault()

    const errors = {}

    if (title.trim() === '') {
      errors.title = 'Please provide a title for your note!'
    } else if (title.length > 40) {
      errors.title = 'Note title cannot exceed 40 characters'
    }

    if (content.trim() === '') {
      errors.content = 'Please provide a content for your note!'
    } else if (content.length > 255) {
      errors.content = 'Note content cannot exceed 255 characters'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

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
        <label>
          <input
            className='title-input-notes'
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Note Title'
          />
          {errors.title && <p className='error-message-goal'>{errors.title}</p>}
        </label>
        <label>
          <textarea
            className='content-input-notes'
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='Write your note here!'
          />
          {errors.content && (
            <p className='error-message-goal'>{errors.content}</p>
          )}
        </label>
        <div>
          <button className='notes-submit-button' type='submit'>
            <FontAwesomeIcon
              icon={faPaperPlane}
              className='submit-paper-plane'
            />
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateNoteForm
