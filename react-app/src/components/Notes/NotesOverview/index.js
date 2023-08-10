import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllNotes } from '../../../store/notes'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons'

import './NotesOverview.css'

function NotesOverview () {
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes.notes)

  useEffect(() => {
    dispatch(fetchAllNotes())
  }, [dispatch])

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
            <p className='note-content'>{note.content}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default NotesOverview
