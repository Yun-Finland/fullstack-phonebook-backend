
const unknownEndpoint = (request, response) => {
  response.status(400).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.message === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}