import { useState, useEffect, use } from 'react'
import Notification from './components/notification'
import Person from './components/person'
import personService from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newNumber, setNewNumber] = useState('')
  const [newName, setNewName] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(data => {setPersons(data)})
  }, [])

  const deletePerson = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return
    personService
      .delete(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    setMessageType('success')
    setMessage(`Deleted ${name}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName, 
      number: newNumber,
    }
    
    const nameExists = persons.some(person => person.name === newName) ? true : false
    if (nameExists) {
      if(!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) return
      personService
        .update(persons.find(person => person.name === newName).id, personObject)
        .then(data => {
          setPersons(persons.map(person => person.name !== newName ? person : data))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessageType('error')
          setMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.name !== newName))
        })
      setMessageType('success')
      setMessage(`Updated ${newName} number to ${newNumber}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      return
    }
    personService
      .create(personObject)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
      })
      setMessageType('success')
      setMessage(`Added ${newName} with number ${newNumber}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
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
      <Notification message={message} type={messageType} />
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
            <Person 
              key={person.name}
              person={person}
              deletePerson={() => deletePerson(person.id, person.name)}
            />
          )}
        </ul>
    </div>
  )

}

export default App