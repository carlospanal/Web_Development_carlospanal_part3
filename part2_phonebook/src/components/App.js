import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personService from '../services/persons'
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  if (message.mType=== "success"){
    return (
      <div className="greenmessage">
        {message.content}
      </div>
    )
  }
  if (message.mType=== "error"){
    return (
      <div className="redmessage">
        {message.content}
      </div>
    )
  }
}

const FilterComp = ({filter,handleFilterChange}) => {

  return(
    <input
      value={filter}
      onChange={handleFilterChange}
    />
  )
}

const FilteredNames = ({fpersons,setPersons,setFilteredPersons,persons}) => {

  return (
    <div>
      <ul>
        {fpersons.map(curr_person => 
          <li key={curr_person.name}>
            {curr_person.name} {curr_person.number}
            <button onClick={() => {
              if (window.confirm("Do you really want to delete?")) { 
                personService
                  .deleteId(curr_person.id)
                  .then(() => {
                    setPersons(persons.filter(person => person.id !== curr_person.id))
                    setFilteredPersons(fpersons.filter(person => person.id !== curr_person.id))
                  })
              }
            }}>delete</button>
          </li>
        )}
      </ul>
     </div>
  )
}

const NewNameComp = ({addName,newName,handleNameChange,newNumber,handleNumberChange}) => {

  return(
    <form onSubmit={addName}>
    <p>name:</p>
    <input
      value={newName}
      onChange={handleNameChange}
    />
    <p>number:</p>
    <input
      value={newNumber}
      onChange={handleNumberChange}
    />
    <button type="submit">save</button>
    </form>  
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas',
      number: '112233' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ filteredPersons, setFilteredPersons ] = useState(persons)
  const iniMessage={
    content:"Page loaded successfully",
    mType: "success"
  }
  const [ message, setMessage] = useState(iniMessage)

  useEffect(() => {
    console.log('effect')
    personService
      .initGet()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
        setFilteredPersons(response)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const tempMessage = (tmessage,mstime)=>{
    setMessage(tmessage)
    setTimeout(() => {setMessage(null)}, mstime)
  }

  const checkName = (nameObject) => {

    if (persons.filter(person => person.name===nameObject.name).length === 0){ 
      setPersons(persons.concat(nameObject))
      setNewName('')
      setFilteredPersons(filteredPersons.concat(nameObject)) 

      personService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response))
        tempMessage({
          content:"New name added to list",
          mType: "success"
          } 
          ,5000)
      })
    
    }
    else{
      const targetId=persons.filter(person => person.name===nameObject.name)[0].id
      if (window.confirm(
        `${nameObject.name} already existing, do you want to update the phone number?`)){
          personService
            .updateId(targetId,nameObject)
            .then(response => {
              setPersons(persons.map(person => person.id !== targetId ? person : response))
              setFilteredPersons(filteredPersons.map(person => person.id !== targetId ? person : response))
              tempMessage({
                content: "Phone number was successfully updated",
                mType: "success"
              }
              ,5000)
            })
            .catch(() => {
              tempMessage({
                content:`This person: '${nameObject.name}', was already removed from server`,
                mType: "error"
                } 
                ,5000)
              setPersons(persons.filter(person => person.name !== nameObject.name))
              console.log(persons.filter(person => person.id !== nameObject.id))
              setFilteredPersons(filteredPersons.filter(person => person.name !== nameObject.name))
            })

        }
    }     
  }

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    checkName(nameObject,persons)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setFilteredPersons(persons.filter(person => 
      person.name.includes(event.target.value)))
  }
  setTimeout(() => {
    if (message===iniMessage){setMessage(null)}
  }, 5000)

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
        <p>Filter by name</p>
        <FilterComp
          filter={filter}
          handleFilterChange={handleFilterChange}
        />

      <h2>Add new</h2>
        <NewNameComp 
          addName={addName}
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}
        />
   
      <h2>Numbers</h2>
      <FilteredNames
        fpersons={filteredPersons}
        setPersons={setPersons}
        setFilteredPersons={setFilteredPersons}
        persons={persons}
        />
    </div>
  )

  

}

export default App