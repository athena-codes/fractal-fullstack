import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import notesReducer, {
  fetchAllNotes,
  updateExistingNote,
  deleteExistingNote
} from '../../../store/notes'
import { NavLink } from 'react-router-dom'
import { useModal } from '../../../context/Modal'
import OpenModalButton from '../../OpenModalButton'
import UpdateNoteModal from '../UpdateNoteModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faNotesMedical,
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

import './NotesOverview.css'

function NotesOverview () {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const notes = useSelector(state => state.notes.notes)
  const [selectedNoteId, setSelectedNoteId] = useState(null)

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

  return (
    <>
      <div className='notes-heading-new-note'>
        <h2 className='notes-heading'>Your Notes</h2>
        <NavLink exact to='/new-note' className='navigation-link'>
          <FontAwesomeIcon className='new-note-button' icon={faNotesMedical} />{' '}
        </NavLink>
      </div>

      <div className='notes-overview'>
        {notes.map(note => (
          <div key={note.id} className='note-card'>
            <h3 className='note-title'>{note.title}</h3>
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
                <FontAwesomeIcon icon={faPenToSquare} className='update' />
              }
              onModalClose={() => setSelectedNoteId(null)}
            />
            <button
              onClick={() => handleDeleteNote(note.id)}
              className='delete-button'
            >
              {<FontAwesomeIcon icon={faTrash} className='delete' />}
            </button>

            <p className='note-content'>{note.content}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default NotesOverview
