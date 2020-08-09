const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('content', (req) => {
  if (req.method === 'POST') { return JSON.stringify(req.body) }
  return null
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :content',
))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => {
    res.json(people)
  })
})

app.get('/info', (req, res) => {
  Person.countDocuments({}, (err, count) => {
    res.send(
      `<h1>Phonebook has info for ${count} people</h1>
      <br>
      ${new Date()}
      `,
    )
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { body } = request

  if (!body.name || !body.number) {
    response.status(400).json({
      error: 'content missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(() => {
    response.json(person.toJSON())
  })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const reqId = request.params.id
  const { body } = request

  const upPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(reqId, upPerson, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

// error/Unkendp handling
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
