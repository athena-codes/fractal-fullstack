import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import notesReducer, {
  fetchAllNotes,
  updateExistingNote,
  deleteExistingNote
} from '../../../store/notes'
import { NavLink, useHistory } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import { createNewNote } from '../../../store/notes'
import OpenModalButton from '../../OpenModalButton'
import UpdateNoteModal from '../UpdateNoteModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faNotesMedical,
  faPenToSquare,
  faTrash,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons'

import './NotesOverview.css'

function NotesOverview () {
  const dispatch = useDispatch()
  const history = useHistory()
  const notes = useSelector(state => state.notes.notes)
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [noteErrors, setNoteErrors] = useState([])
  const { closeModal } = useModal()

  useEffect(() => {
    dispatch(fetchAllNotes())
  }, [dispatch])

  const handleUpdateNote = async updatedNoteData => {
    try {
      await dispatch(updateExistingNote(selectedNoteId, updatedNoteData))
      closeModal()
      dispatch(fetchAllNotes())
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteNote = async noteId => {
    try {
      await dispatch(deleteExistingNote(noteId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateNote = async e => {
    e.preventDefault()

    const errors = {}

    if (title.trim() === '') {
      errors.title = 'Please provide a title for your note!'
    } else if (title.length > 40) {
      errors.title = 'Note title cannot exceed 40 characters'
    }

    if (content.trim() === '') {
      errors.content = 'Please provide content for your note!'
    } else if (content.length > 255) {
      errors.content = 'Note content cannot exceed 255 characters'
    }

    if (Object.keys(errors).length > 0) {
      setNoteErrors(errors)
      return
    }

    const noteData = {
      title: title,
      content: content
    }

    const data = await dispatch(createNewNote(noteData))

    if (data && data.errors) {
      setNoteErrors(data.errors)
    } else {
      history.push('/notes')
    }
  }

  if (!notes) {
    return <div>Loading...</div>
  }

  return (
    <div className='notes-container'>
      <div className='notes-heading-new-note'>
        <h2 className='notes-heading'>Your Notes</h2>
        <NavLink exact to='/new-note' className='navigation-link'>
          <FontAwesomeIcon className='new-note-button' icon={faNotesMedical} />{' '}
        </NavLink>
      </div>
      {notes.length === 0 ? (
        <div className='create-note-section'>
          <h2>Create your first note!</h2>
          <form onSubmit={handleCreateNote}>
            <label>
              <input
                className='title-input-notes'
                type='text'
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='Note Title'
              />
              {noteErrors.title && (
                <p className='error-message-goal'>{noteErrors.title}</p>
              )}
            </label>
            <label>
              <textarea
                className='content-input-notes'
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder='Write your note here!'
              />
              {noteErrors.content && (
                <p className='error-message-goal'>{noteErrors.content}</p>
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
      ) : (
        <div className='notes-overview'>
          {notes.map(note => (
            <div key={note.id} className='note-card'>
              <div className='notes-title-update-delete-buttons'>
                <h3 className='note-title'>{note.title}</h3>

                <div className='notes-update-delete-buttons'>
                  <OpenModalButton
                    modalComponent={
                      <UpdateNoteModal
                        noteId={note.id}
                        title={note.title}
                        content={note.content}
                        onSubmit={handleUpdateNote}
                        onClose={() => setSelectedNoteId(null)}
                      />
                    }
                    buttonText={
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className='update-note'
                      />
                    }
                    onModalClose={() => setSelectedNoteId(null)}
                  />
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className='delete-button'
                  >
                    {<FontAwesomeIcon icon={faTrash} className='delete' />}
                  </button>
                </div>
              </div>
              <p className='note-content'>{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotesOverview
