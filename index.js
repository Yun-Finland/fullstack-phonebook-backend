const express = require('express')

const app = express();

app.use(express.json())

let persons =[
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response)=>{
  return response.send(persons)
})

app.get('/info', (request, response)=> {
  response.send(`Phonebook has info for ${persons.length} people <br/><br/> ${new Date()}`)
})

app.get('/', (request, response)=> {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response)=> {
  const findId = request.params.id
  const returnedPerson = persons.find(person => Number(person.id) === Number(findId))

  if(returnedPerson){
    response.json(returnedPerson)
  }else{
    response.status(404).json({error: 'cannot find'})
  }
})

const generateId = () => {
  const MaxId = persons.length > 0
    ? Math.max(...persons.map(n=>n.id)) 
    : 0
  return MaxId+1
}

app.post('/api/persons', (request, response)=> {
  const body = request.body

  if(!body.name){
    return response.status(400).json({error: 'Name cannot be empty'})
  }

  if(persons.find(person => person.name === body.name)){
    return response.status(400).json({error: 'Name must be unique'})
  }

  if(!body.number){
    return response.status(400).json({error: 'Number cannot be empty'})
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  console.log(newPerson)
  persons = persons.concat(newPerson)

  response.status(200).json(newPerson)
})

app.delete('/api/persons/:id', (request, response)=>{
  const findId = request.params.id
  const persons = persons.filter(person => Number(person.id)!==Number(findId))
  
  response.status(204).end()
})


const PORT = 3001

app.listen(PORT, ()=>{
  console.log(`Listen to the PORT ${PORT}`)
})