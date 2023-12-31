const CREATE_GOAL = 'goals/createGoal'
const GET_GOAL = 'goals/getGoal'
const UPDATE_GOAL = 'goals/updateGoal'
const DELETE_GOAL = 'goals/deleteGoal'
const GET_ALL_GOALS = 'goals/getAllGoals'
const GET_TODOS_FOR_GOAL = 'GET_TODOS_FOR_GOAL'

// Action Creators
const createGoal = goal => ({
  type: CREATE_GOAL,
  payload: goal
})

const getGoal = goal => ({
  type: GET_GOAL,
  payload: goal
})

const updateGoal = goal => ({
  type: UPDATE_GOAL,
  payload: goal
})

const deleteGoal = goalId => ({
  type: DELETE_GOAL,
  payload: goalId
})

const getAllGoals = goals => ({
  type: GET_ALL_GOALS,
  payload: goals
})

const getTodosForGoal = todos => ({
  type: GET_TODOS_FOR_GOAL,
  payload: todos
})

// Thunks
export const createNewGoal = (goalData) => async dispatch => {
  try {
    const { title, description, end_date, timeframe } = goalData
    const response = await fetch('/api/goals/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({title, description, end_date, timeframe})
    })

    if (!response.ok) {
      throw new Error('Failed to create goal')
    }

    const goal = await response.json()

    dispatch(createGoal(goal))
    return goal

  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchGoal = goalId => async dispatch => {
  try {
    const response = await fetch(`api/goals/${goalId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch goal')
    }

    const goal = await response.json()

    dispatch(getGoal(goal))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const updateExistingGoal =
  (goalId, goalData) => async (dispatch, getState) => {
    try {
      const { progress } = goalData

      if (progress !== undefined) {
        // If progress is provided in goalData, update only the progress using the new API endpoint
        const progressResponse = await fetch(`api/goals/${goalId}/progress`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress }) // Send only the progress field in the request body
        })

        if (!progressResponse.ok) {
          throw new Error('Failed to update goal progress')
        }
      }

      // Update the other fields of the goal using the original API endpoint
      const response = await fetch(`api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData) // Send the entire goalData object
      })

      if (!response.ok) {
        throw new Error('Failed to update goal')
      }

      const updatedGoal = await response.json()

      // Calculate the progress based on the number of completed todos for this goal
      const todos = getState().todos.todos
      const completedTodos = todos.filter(
        todo => todo.goal_id === goalId && todo.completed
      )
      const totalTodos = todos.filter(todo => todo.goal_id === goalId).length
      const calculatedProgress = (completedTodos.length / totalTodos) * 100

      // Update the progress field of the goal
      updatedGoal.progress = parseFloat(calculatedProgress.toFixed(2)) // Convert progress to a number

      // Dispatch an action to update the goal in the store
      dispatch(updateGoal(updatedGoal))
    } catch (error) {
      console.error(error)
      // Handle error as needed
    }
  }



export const deleteExistingGoal = goalId => async dispatch => {
try {
    const response = await fetch(`api/goals/${goalId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete goal')
    }

    dispatch(deleteGoal(goalId))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchAllGoals = () => async dispatch => {
  try {
    const response = await fetch('/api/goals/')

    if (!response.ok) {
      throw new Error('Failed to fetch goals')
    }

    const goals = await response.json()

    if (goals) {
      dispatch(getAllGoals(goals))
    }
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}


export const fetchTodosForGoal = goalId => async dispatch => {
  try {
    const response = await fetch(`api/goals/${goalId}/todo/`)

    if (!response.ok) {
      throw new Error('Failed to fetch todos for goal')
    }

    const todos = await response.json()

    dispatch(getTodosForGoal(todos))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

// Reducer
const initialState = {
  goals: [],
  goal: null,
  todos: []
}

const goalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GOAL:
      return {
        ...state,
        goals: [...state.goals, action.payload]
      }
    case GET_GOAL:
      return {
        ...state,
        goal: action.payload
      }
    case UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload.id ? action.payload : g
        ),
        goal: action.payload
      }
    case DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
        goal: null
      }
    case GET_ALL_GOALS:
      return {
        ...state,
        goals: action.payload

      }
    case GET_TODOS_FOR_GOAL:
      return {
        ...state,
        todos: action.payload
      }
    default:
      return state
  }
}

export default goalsReducer
