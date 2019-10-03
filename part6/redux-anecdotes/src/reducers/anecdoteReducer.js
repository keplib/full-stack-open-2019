import anecdotesService from '../services/anecdotes'

export const vote = id => ({
  type: 'VOTE',
  data: { id }
})

export const addNew = data => ({
  type: 'NEW_ANECDOTE',
  data
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1}
      return state
        .map(a => a.id === id ? changedAnecdote : a)
        .sort((a, b) => b.votes - a.votes)
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export default anecdoteReducer