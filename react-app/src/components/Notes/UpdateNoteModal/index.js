import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../../context/Modal'
import { updateExistingNote } from '../../../store/notes'

import './UpdateNoteModal.css'

const UpdateNoteModal = ({ noteId, title, content }) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const [updatedTitle, setUpdatedTitle] = useState(title)
  const [updatedContent, setUpdatedContent] = useState(content)

  const handleSubmit = async e => {
    e.preventDefault()

    const updatedNoteData = {
      title: updatedTitle,
      content: updatedContent
    }

    try {
      await dispatch(updateExistingNote(noteId, updatedNoteData))
      closeModal()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='update-note-modal'>
      <h2>Update Note</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type='text'
            value={updatedTitle}
            onChange={e => setUpdatedTitle(e.target.value)}
          />
        </label>
        <label>
          Content
          <textarea
            value={updatedContent}
            onChange={e => setUpdatedContent(e.target.value)}
          />
        </label>
        <button type='submit'>Save</button>
        <button type='button' onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  )
}

export default UpdateNoteModal
