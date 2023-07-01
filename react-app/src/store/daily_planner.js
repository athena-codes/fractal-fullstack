// Action Types
const GET_DAILY_PLANNERS = 'daily_planner/getDailyPlanner'
const GET_DAILY_PLANNER_SLOTS = 'daily_planner/getDailyPlannerSlots'
const GET_DAILY_PLANNER_SLOT_BY_ID = 'daily_planner/getDailyPlannerSlotById'
const ASSIGN_TODO_TO_SLOT = 'daily_planner/assignTodoToSlot'

// Action Creators
const getDailyPlanners = dailyPlanner => ({
  type: GET_DAILY_PLANNERS,
  payload: dailyPlanner
})

const getDailyPlannerSlots = slots => ({
  type: GET_DAILY_PLANNER_SLOTS,
  payload: slots
})

const getDailyPlannerSlotById = slot => ({
  type: GET_DAILY_PLANNER_SLOT_BY_ID,
  payload: slot
})

const assignTodoToSlot = slot => ({
  type: ASSIGN_TODO_TO_SLOT,
  payload: slot
})

// Thunks
export const fetchDailyPlannersThunk = () => async dispatch => {
  try {
    const response = await fetch(`/api/daily-planner/`)

    if (!response.ok) {
      throw new Error('Failed to fetch daily planner')
    }

    const dailyPlanners = await response.json()

    dispatch(getDailyPlanners(dailyPlanners))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchDailyPlannerSlotsThunk = dailyPlannerId => async dispatch => {
  try {
    const response = await fetch(`/api/daily-planner/${dailyPlannerId}/slots`)

    if (!response.ok) {
      throw new Error('Failed to fetch daily planner slots')
    }

    const slots = await response.json()

    dispatch(getDailyPlannerSlots(slots))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchDailyPlannerSlotByIdThunk =
  (dailyPlannerId, slotId) => async dispatch => {
    try {
      const response = await fetch(
        `/api/daily-planner/${dailyPlannerId}/slots/${slotId}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch daily planner slot')
      }

      const slot = await response.json()

      dispatch(getDailyPlannerSlotById(slot))
    } catch (error) {
      console.error(error)
      // Handle error as needed
    }
  }

export const assignTodoToSlotThunk =
  (dailyPlannerId, slotId, todoId) => async (dispatch, getState) => {
    try {
      const response = await fetch(
        `/api/daily-planner/${dailyPlannerId}/slots/${slotId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todo_id: todoId })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to assign todo to slot')
      }

      const updatedSlot = await response.json()

      dispatch(assignTodoToSlot(updatedSlot))

      // Update the slots array in the state with the updated slot
      const { slots } = getState().dailyPlanner
      const updatedSlots = slots.map(slot => {
        if (slot.id === updatedSlot.id) {
          return updatedSlot
        }
        return slot
      })

      dispatch(getDailyPlannerSlots(updatedSlots))
    } catch (error) {
      console.error(error)
      // Handle error as needed
    }
  }

// Reducer
const initialState = {
  dailyPlanner: null,
  slots: [],
  slot: null
}

const dailyPlannerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DAILY_PLANNERS:
      return {
        ...state,
        dailyPlanner: action.payload
      }
    case GET_DAILY_PLANNER_SLOTS:
      return {
        ...state,
        slots: action.payload
      }
    case GET_DAILY_PLANNER_SLOT_BY_ID:
      return {
        ...state,
        slot: action.payload
      }
    case ASSIGN_TODO_TO_SLOT:
      return {
        ...state,
        slots: state.slots.map(slot => {
          if (slot.id === action.payload.id) {
            return action.payload
          }
          return slot
        })
      }
    default:
      return state
  }
}

export default dailyPlannerReducer
