require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

//Middleware.
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

//Create a custom token req-body.
morgan.token('req-body', (req) => JSON.stringify(req.body))

//Create custom formatting for logging.
const postFormat =
  ':method :url :status :res[content-length] - :response-time ms :req-body'
app.use(morgan(postFormat))

//Routes.
app.get('/api/info', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const personsCount = persons.length
      const currentTimeDate = new Date()
      response.send(
        `<p>Phonebook has info for ${personsCount} persons</p> <p>${currentTimeDate}</p>`
      )
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((deletedPerson) => {
      response.status(204).json(deletedPerson)
    })
    .catch((error) => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number)
    return response
      .status(400)
      .json({ error: 'The name or number is missing.' })

  const newPerson = new Person({ name, number })

  newPerson
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error))
})

//Unknown endpoint middleware.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint ' })
}
app.use(unknownEndpoint)

//Error handler middleware.
const errorHandler = (error, request, response) => {
  console.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })

  if (error.name === 'ValidationError') return response.status(400).json(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
