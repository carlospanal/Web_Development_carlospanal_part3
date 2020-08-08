const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const Person = require('./models/person')
console.log(Person)


morgan.token('content', function getContent (req) {
  if (req.method==='POST'){return JSON.stringify(req.body)}
  return null
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :content'
))

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    
    console.log("1")
    Person.find({}).then(people => {
      console.log(people)
     // mongoose.connection.close()
      res.json(people)
    })
  })


  app.get('/info', (req, res) => {
    Person.countDocuments({}, function(err,count) {
      res.send(
        `<h1>Phonebook has info for ${count} people</h1>
        <br>
        ${new Date()}
        `
      )
    })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then( person =>{
      if (person) {
        response.json(person.toJSON())
      } else {
        console.log("aaaaa")
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    
  })
 
  app.delete('/api/persons/:id', (request, response, next) => {
    console.log(request.params.id)
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error =>  next(error))
  })

  app.post('/api/persons', (request, response, next) => {
   
    console.log(`ÀAAAA ${request.body}`)
    const body = request.body
    
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })
    console.log(person)

    person.save().
      then(result => {

      console.log('person saved!')
      
      response.json(person)
      
      })
      .catch(error => next(error))
    
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const reqId= request.params.id
    const body = request.body
    
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    
    const upPerson = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(reqId, upPerson, { new: true })
      .then(updatedPerson => {
        console.log(response.data)
        response.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
  })


  //error/Unkendp handling
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })