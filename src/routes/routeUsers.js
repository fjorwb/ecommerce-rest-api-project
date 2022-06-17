
const express = require('express')
const routerUsers = express.Router()

const authorization = require('../middlewares/authorization')

const { getAllUsers, getUserById, getUserByUserName, updateUser, deleteUser } = require('../controllers/usersController')

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        firstname:
 *          type: string
 *        lastname:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        password2:
 *          type: string
 *      required:
 *        - firstname
 *        - lastname
 *        - email
 *        - password
 *        - password2
 *      example:
 *        firstname: john
 *        lastname: smith
 *        email: john@mail.com
 *        password: secret
 *        password2: secret
 */

/**
 * @swagger
 * /users:
 *  post:
 *    summary: register a user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: user registered!
 *        schema:
 *          type: object
 *          items:
 */

routerUsers.route('/')
  .get(authorization(['admin']), getAllUsers)
routerUsers.route('/:id')
  .get(authorization(['admin']), getUserById)
  .put(authorization(['admin']), updateUser)
  .delete(authorization(['admin']), deleteUser)
routerUsers.route('/user/:name')
  .get(authorization(['admin']), getUserByUserName)

module.exports = routerUsers
