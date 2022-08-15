
const express = require('express')
const routerUsers = express.Router()

const authorization = require('../middlewares/authorization')

const { getAllUsers, getUserById, getUserByUserName, updateUser, deleteUser } = require('../controllers/usersController')

routerUsers.route('/')
  .get(authorization(['admin'], ['user']), getAllUsers)
routerUsers.route('/:id')
  .get(authorization(['admin']), getUserById)
  .put(authorization(['admin']), updateUser)
  .delete(authorization(['admin']), deleteUser)
routerUsers.route('/user/:name')
  .get(authorization(['admin']), getUserByUserName)

module.exports = routerUsers
