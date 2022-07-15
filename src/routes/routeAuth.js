const express = require('express')
const routerAuth = express.Router()

const { registerUser, loginUser, logoutUser, loginPage, registerPage, dashboard } = require('../controllers/authController')

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
 */

// User register
/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: register a user
 *    parameters: []
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *          example:
 *            firstname: john
 *            lastname: smith
 *            email: john@mail.com
 *            password: secret
 *            password2: secret
 *    responses:
 *      '200':
 *        description: user registered!
 *        headers: {}
 */

// user login
/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: login a user
 *    parameters: []
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *          example:
 *            email: john@mail.com
 *            password: secret
 *    responses:
 *      '200':
 *        description: user logged in!
 *        headers: {}
 */

routerAuth.route('/login').post(loginUser).get(loginPage)
routerAuth.route('/register').get(registerPage)
routerAuth.route('/register').post(registerUser)
routerAuth.route('/logout').get(logoutUser)
routerAuth.route('/').get(dashboard)

module.exports = routerAuth
