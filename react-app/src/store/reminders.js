// Action Types
const CREATE_REMINDER = 'reminders/createReminder'
const GET_REMINDER = 'reminders/getReminder'
const UPDATE_REMINDER = 'reminders/updateReminder'
const DELETE_REMINDER = 'reminders/deleteReminder'
const GET_ALL_REMINDERS = 'reminders/getAllReminders'

// Action Creators
const createReminder = reminder => ({
  type: CREATE_REMINDER,
  payload: reminder
})

const getReminder = reminder => ({
  type: GET_REMINDER,
  payload: reminder
})

const updateReminder = reminder => ({
  type: UPDATE_REMINDER,
  payload: reminder
})

const deleteReminder = reminderId => ({
  type: DELETE_REMINDER,
  payload: reminderId
})

const getAllReminders = reminders => ({
  type: GET_ALL_REMINDERS,
  payload: reminders
})

// Thunks
export const createNewReminder = reminderData => async dispatch => {
  try {
    const { todo_id } = reminderData
    const response = await fetch('/api/reminders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo_id })
    })

    if (!response.ok) {
      throw new Error('Failed to create Reminder')
    }

    const reminder = await response.json()

    dispatch(createReminder(reminder))
    dispatch(fetchAllReminders()) // Fetch all reminders after creating a new one
    return reminder
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}


export const fetchReminder = reminderId => async dispatch => {
  try {
    const response = await fetch(`/api/reminders/${reminderId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch Reminder')
    }

    const reminder = await response.json()

    dispatch(getReminder(reminder))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const updateExistingReminder =
  (reminderId, reminderData) => async dispatch => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminderData)
      })

      if (!response.ok) {
        throw new Error('Failed to update Reminder')
      }

      const updatedReminder = await response.json()

      dispatch(updateReminder(updatedReminder))
      return updatedReminder
    } catch (error) {
      console.error(error)
      throw error
    }
  }

export const deleteExistingReminder = reminderId => async dispatch => {
  try {
    const response = await fetch(`/api/reminders/${reminderId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete Reminder')
    }

    dispatch(deleteReminder(reminderId))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchAllReminders = () => async dispatch => {
  try {
    const response = await fetch('/api/reminders/')

    if (!response.ok) {
      throw new Error('Failed to fetch Reminders')
    }

    const reminders = await response.json()

    dispatch(getAllReminders(reminders))
    return reminders
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

// Reducer
const initialState = {
  reminders: [], // Initialize as an empty array
  reminder: null
}

const remindersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REMINDER:
      return {
        ...state,
        reminders: state.reminders
      }
    case GET_REMINDER:
      return {
        ...state,
        reminder: action.payload // Update the reminder property
      }
    case UPDATE_REMINDER:
      return {
        ...state,
        reminders: state.reminders.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
        reminder:
          action.payload.id === state.reminder?.id
            ? action.payload
            : state.reminder // Update the reminder property if needed
      }
    case DELETE_REMINDER:
      return {
        ...state,
        reminders: state.reminders.filter(r => r.id !== action.payload),
        reminder: action.payload === state.reminder?.id ? null : state.reminder // Clear the reminder property if needed
      }
    case GET_ALL_REMINDERS:
      return {
        ...state,
        reminders: action.payload,
        reminder: null // Clear the reminder property when fetching all reminders
      }
    default:
      return state
  }
}

export default remindersReducer
