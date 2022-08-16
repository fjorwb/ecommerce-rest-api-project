const express = require('express')
const routerDocs = express.Router()
const swagger = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio / eCommerce RESTFul API',
      version: '1.0.0',
      description:
        'RESTFul API for an e-commerce.',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/'
      }
    }
  },
  apis: ['swagger-ecomm.yaml']
}

const specs = swagger(swaggerOptions)

routerDocs.use('/', swaggerUi.serve)
routerDocs.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true
  })
)

module.exports = routerDocs
