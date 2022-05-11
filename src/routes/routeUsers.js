
const express = require('express')
const routerUsers = express.Router()

const {getUsers, getUserById, createUser, updateUser, deleteUser} = require('../controllers/usersController')

routerUsers.route('/').get(getUsers)
routerUsers.route('/:id').get(getUserById)
routerUsers.route('/').post(createUser)
routerUsers.route('/:id').put(updateUser)
routerUsers.route('/:id').delete(deleteUser)

module.exports = routerUsers