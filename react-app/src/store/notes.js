const CREATE_NOTE = 'notes/createNote'
const GET_NOTE = 'notes/getNote'
const UPDATE_NOTE = 'notes/updateNote'
const DELETE_NOTE = 'notes/deleteNote'
const GET_ALL_NOTES = 'notes/getAllNotes'

// Action Creators
const createNote = note => ({
  type: CREATE_NOTE,
  payload: note
})

const getNote = note => ({
  type: GET_NOTE,
  payload: note
})

const updateNote = note => ({
  type: UPDATE_NOTE,
  payload: note
})

const deleteNote = noteId => ({
  type: DELETE_NOTE,
  payload: noteId
})

const getAllNotes = notes => ({
  type: GET_ALL_NOTES,
  payload: notes
})

// Thunks
export const createNewNote = noteData => async dispatch => {
  try {
    const { content, title } = noteData
    const response = await fetch('/api/notes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, title })
    })

    if (!response.ok) {
      throw new Error('Failed to create note')
    }

    const note = await response.json()

    dispatch(createNote(note))
    return note
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchNote = noteId => async dispatch => {
  try {
    const response = await fetch(`/api/notes/${noteId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch note')
    }

    const note = await response.json()

    dispatch(getNote(note))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const updateExistingNote =
  (noteId, noteData) => async (dispatch, getState) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })

      if (!response.ok) {
        throw new Error('Failed to update note')
      }

      const updatedNote = await response.json()

      dispatch(updateNote(updatedNote))
    } catch (error) {
      console.error(error)
      // Handle error as needed
    }
  }

export const deleteExistingNote = noteId => async dispatch => {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete note')
    }

    dispatch(deleteNote(noteId))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchAllNotes = () => async dispatch => {
  try {
    const response = await fetch('/api/notes/')

    if (!response.ok) {
      throw new Error('Failed to fetch notes')
    }

    const notes = await response.json()

    dispatch(getAllNotes(notes))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}


// Reducer
const initialState = {
  notes: [],
  note: null
}

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NOTE:
      return {
        ...state,
        notes: [...state.notes, action.payload]
      }
    case GET_NOTE:
      return {
        ...state,
        note: action.payload
      }
    case UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map(n =>
          n.id === action.payload.id ? action.payload : n
        ),
        note: action.payload
      }
    case DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter(n => n.id !== action.payload),
        note: null
      }
    case GET_ALL_NOTES:
      return {
        ...state,
        notes: action.payload
      }
    default:
      return state
  }
}

export default notesReducer
