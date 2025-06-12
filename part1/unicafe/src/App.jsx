import { useState } from 'react'

const Header = (props) => <h1>{props.text}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const ValueField = ({name, value, unit}) => <tr><td>{name}</td><td>{value} {unit}</td></tr>

const ValueTable = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100

  return (
    <table>
      <tbody>
        <ValueField name="good" value={good} />
        <ValueField name="neutral" value={neutral} />
        <ValueField name="bad" value={bad} />
        <ValueField name="all" value={total} />
        <ValueField name="average" value={average} />
        <ValueField name="positive" value={positive} unit="%" /> 
      </tbody>
    </table>
  )
}


const Statistics = ({good, neutral, bad}) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
    <div>
      <h1>Statistics</h1>
      <ValueTable good={good} neutral={neutral} bad={bad} />
    </div>
  )
}




const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <Header text="Give feedback" />
      <Button onClick={increaseGood} text="good" />
      <Button onClick={increaseNeutral} text="neutral" />
      <Button onClick={increaseBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App