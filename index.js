const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('content', function getContent (req) {
  if (req.method==='POST'){return JSON.stringify(req.body)}
  return null
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :content'
))
let persons = [
    {
      name: "carlos aaa",
      number: "111",
      id: 1
    },
    {
      name: "carlos bbb",
      number: "222",
      id: 2
    },
    {
      name: "carlos ccc",
      number: "333",
      id: 3
    }
  ]
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })


  app.get('/info', (req, res) => {
    res.send(
      `<h1>Phonebook has info for ${persons.length} people</h1>
      <br>
      ${new Date()}
      `
    )
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {ç
      console.log("aaaaa")
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const Id = Math.floor(Math.random() * 100000000)
    return Id
  }

  app.post('/api/persons', (request, response) => {
    
    const body = request.body
    
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    if (persons.find(person => person.name === body.name)) {
      return response.status(409).json({ 
        error: 'Name must be unique' 
      })
    }
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.put('/api/persons/:id', (request, response) => {
    const reqId= Number(request.params.id)
    const body = request.body
    
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    if (persons.find(person => person.id === reqId)) {
      const upPerson = {
        name: body.name,
        number: body.number,
        id: reqId
      }
      targetIndex= persons.findIndex(person => person.id === reqId)
      persons[targetIndex]=upPerson
      response.json(upPerson)
    }
    else{
      return response.status(404).json({ 
        error: 'Not found' 
      })
    }
  
    
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })