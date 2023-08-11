import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useModal } from '../../../context/Modal'
import { updateExistingNote } from '../../../store/notes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'


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
    <h2 className='update-note-heading'>Update Note</h2>
    <form onSubmit={handleSubmit}>
      <div className='update-note-input-label'>
        <label className='label-update-note'>Title</label>
        <input
          type='text'
          value={updatedTitle}
          onChange={e => setUpdatedTitle(e.target.value)}
          className='input-update-note-title'
        />
      </div>
      <div className='update-note-input-label'>
        <label className='label-update-note'>Content</label>
        <textarea
          value={updatedContent}
          onChange={e => setUpdatedContent(e.target.value)}
          className='input-create-note-notes'
        />
      </div>
      <div>
        <button className='note-submit-btn' type='submit'>
          <FontAwesomeIcon icon={faPaperPlane} className='submit-paper-plane' />
        </button>
      </div>
    </form>
  </div>
)

}

export default UpdateNoteModal
