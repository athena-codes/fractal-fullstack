// Action Types
const CREATE_TODO = 'todos/createTodo'
const GET_TODO = 'todos/getTodo'
const UPDATE_TODO = 'todos/updateTodo'
const DELETE_TODO = 'todos/deleteTodo'
const GET_ALL_TODOS = 'todos/getAllTodos'

// Action Creators
const createTodo = todo => ({
  type: CREATE_TODO,
  payload: todo
})

const getTodo = todo => ({
  type: GET_TODO,
  payload: todo
})

const updateTodo = todo => ({
  type: UPDATE_TODO,
  payload: todo
})

const deleteTodo = todoId => ({
  type: DELETE_TODO,
  payload: todoId
})

const getAllTodos = todos => ({
  type: GET_ALL_TODOS,
  payload: todos
})

// Thunks
export const createNewTodo = todoData => async dispatch => {
  try {
    const { name, priority, description, notes, reminder, completed, goal_id } =
      todoData
    const response = await fetch('/api/todos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        priority: parseInt(priority),
        description,
        notes,
        reminder,
        completed,
        goal_id: parseInt(goal_id)
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create TODO')
    }

    const todo = await response.json()


    dispatch(createTodo(todo))
    return todo
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchTodo = todoId => async dispatch => {
  try {
    const response = await fetch(`api/todos/${todoId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch TODO')
    }

    const todo = await response.json()

    dispatch(getTodo(todo))
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const updateExistingTodo = (todoId, todoData) => async dispatch => {
  try {
    const response = await fetch(`api/todos/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    })

    if (!response.ok) {
      throw new Error('Failed to update TODO')
    }

    return response.json() // Return the parsed JSON directly
  } catch (error) {
    console.error(error)
    throw error
  }
}


export const deleteExistingTodo = todoId => async dispatch => {
  try {
    const response = await fetch(`api/todos/${todoId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete TODO')
    }

    dispatch(deleteTodo(todoId))
    return response
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}

export const fetchAllTodos = () => async dispatch => {
  try {
    const response = await fetch('/api/todos/')

    if (!response.ok) {
      throw new Error('Failed to fetch TODOs')
    }

    const todos = await response.json()

    dispatch(getAllTodos(todos))
    return todos
  } catch (error) {
    console.error(error)
    // Handle error as needed
  }
}


// Reducer
const initialState = {
  todos: [],
  todo: null
}

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case GET_TODO:
      return {
        ...state,
        todo: action.payload
      }
    case UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        todo: action.payload
      }
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload),
        todo: null
      }
    case GET_ALL_TODOS:
      return {
        ...state,
        todos: action.payload
      }
    default:
      return state
  }
}

export default todosReducer
