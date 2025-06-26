import { useState, useEffect, use } from 'react'
import axios from 'axios'
import Person from './components/person'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newNumber, setNewNumber] = useState('')
  const [newName, setNewName] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const fetchDataHook = () => {
    axios
        .get('http://localhost:3001/persons')
        .then(response => {
          setPersons(response.data)
        })
  }
  useEffect(fetchDataHook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName, 
      number: newNumber
    }
    
    const nameExists = persons.some(person => person.name === newName) ? true : false
    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat( personObject ))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = newFilter === '' 
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      ) 

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          filter shown with: <input 
            value = {newFilter}
            onChange = {handleFilterChange}
          />
        </div>
      </form>
      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value = {newName}
            onChange = {handleNameChange}
          />
        </div>
        <div>
          number: <input 
            value = {newNumber}
            onChange = {handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        <ul>
          {personsToShow.map(person =>
            <Person key={person.name} person={person} />
          )}
        </ul>
    </div>
  )

}

export default App