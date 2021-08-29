const config = require('./utils/config')
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')

const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')
const Person = require('./models/person.js')

const url = config.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use('/api/persons', personsRouter)

app.get('/info', (request, response)=> {
  Person.find({}).then(persons=> {
    response.send(`Phonebook has info for ${persons.length} people <br/><br/> ${new Date()}`)
  }) 
})

app.get('/', (request, response)=> {
  response.send('<h1>Hello World!</h1>')
})

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

app.listen(config.PORT, ()=>{
  console.log(`Listen to the PORT ${config.PORT}`)
})