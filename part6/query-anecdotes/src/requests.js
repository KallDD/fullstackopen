import axios from 'axios'

export const getAnecdotes = () =>
  axios.get('http://localhost:3001/anecdotes').then(res => res.data)

export const createAnecdote = (content) =>
  axios.post('http://localhost:3001/anecdotes', { content, votes: 0 })
    .then(res => res.data)

export const voteAnecdote = (anecdote) =>
  axios.patch(`http://localhost:3001/anecdotes/${anecdote.id}`, { ...anecdote, votes: anecdote.votes + 1 })
    .then(res => res.data)
