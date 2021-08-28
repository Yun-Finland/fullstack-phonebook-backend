require('dotenv').config()
const express = require('express')
const Person = require('./models/person.js')

const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.get('/api/persons', (request, response)=>{
  Person.find({}).then(persons=>{
    response.json(persons)
  })
})

app.get('/info', (request, response)=> {
  Person.find({}).then(persons=> {
    response.send(`Phonebook has info for ${persons.length} people <br/><br/> ${new Date()}`)
  }) 
})

app.get('/', (request, response)=> {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response, next)=> {

  Person.findById(request.params.id)
    .then(returnedPerson=>{
      if(returnedPerson){
        response.json(returnedPerson)
      }else{
        response.status(404).json({error: 'cannot find'})
      }
    })
    .catch(error => next(error))
  
})

app.post('/api/persons', (request, response)=> {
  const body = request.body

  if(!body.name){
    return response.status(400).json({error: 'Name cannot be empty'})
  }

  if(!body.number){
    return response.status(400).json({error: 'Number cannot be empty'})
  }

  Person.find({})
    .then(persons => {
      if(persons.find(person => person.name === body.name)){
        return response.status(400).json({error: 'Name must be unique'})
      }else{
        const newPerson = new Person ({
          name: body.name,
          number: body.number,
        })

        newPerson.save().then(savedPerson => response.json(savedPerson))
      }
    })

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const updatePerson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(body.id, updatePerson, {new:true})
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next)=>{

  Person.findByIdAndRemove(request.params.id)
    .then(result=>{
      response.status(204).end()
    })
    .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(400).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.message === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
  console.log(`Listen to the PORT ${PORT}`)
})