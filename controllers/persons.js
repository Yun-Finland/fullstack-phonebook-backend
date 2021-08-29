const personsRouter = require('express').Router()
const { request } = require('express')
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(persons){
        response.json(person.toJSON())
      }else{
        response.status(404).send({error:'cannot find'})
      }
    })
    .catch(error=>next(error))
})

personsRouter.post('/', (request, response, next)=>{
  const body = request.body

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))

})

personsRouter.put('/:id', (request, response, next)=>{
  const body = request.body
  
  const updatedPerson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new:true })
    .then(updateperson => {
      response.json(updateperson.toJSON())
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next)=>{
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error=>next(error))
})

module.exports= personsRouter