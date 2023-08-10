import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllNotes } from '../../../store/notes'

function NotesOverview () {
  const dispatch = useDispatch()
  const notes = useSelector(state => state.notes.notes)
  console.log('NOTES --->', notes)

  useEffect(() => {
    dispatch(fetchAllNotes())
  }, [dispatch])

  return (
    <div className='notes-overview'>
      <h2>Your Notes</h2>
      {notes.map(note => (
        <div key={note.id} className='note-card'>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  )
}

export default NotesOverview
