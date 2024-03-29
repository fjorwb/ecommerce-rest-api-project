const express = require('express')
const routerAuth = express.Router()

const { registerUser, loginUser, logoutUser, loginPage, registerPage, dashboard } = require('../controllers/authController')

routerAuth.route('/login').post(loginUser).get(loginPage)
routerAuth.route('/register').get(registerPage)
routerAuth.route('/register').post(registerUser)
routerAuth.route('/logout').get(logoutUser)
routerAuth.route('/').get(dashboard)

module.exports = routerAuth
