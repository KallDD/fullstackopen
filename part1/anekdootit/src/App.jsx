import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>
const Header = ({text}) => <h1>{text}</h1>
const Anecdote = ({anecdotes, votes, selection}) => {
  return (
    <div>
      {anecdotes[selection]}<br />
      has {votes[selection]} votes
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))
  const [selected, setSelected] = useState(0)
  const [mostVoted, setMostVoted] = useState(0)

  const chooseRandomAnecdote = () => {
    const randInt = Math.floor(Math.random()*1000)
    const randIndex = randInt % anecdotes.length
    if (randIndex === selected) {
      chooseRandomAnecdote()
      return
    }
    setSelected(randIndex)
  }

  const voteAnecdote = (index) => {
    const copy = {...votes}
    copy[index] += 1
    setVotes(copy)

    if (copy[index] > copy[mostVoted]) {
      setMostVoted(index)
    }
  }

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Anecdote anecdotes={anecdotes} votes={votes} selection={selected} />
      <Button onClick={() => voteAnecdote(selected)} text="Vote" />
      <Button onClick={chooseRandomAnecdote} text="Next Anecdote" />
      <Header text="Anecdote with most votes" />
      <Anecdote anecdotes={anecdotes} votes={votes} selection={mostVoted} />
    </div>
  )
}

export default App