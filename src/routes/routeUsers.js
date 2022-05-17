
const express = require('express')
const routerUsers = express.Router()

const {getUsers, getUserById, createUser, updateUser, deleteUser} = require('../controllers/usersController')

routerUsers.route('/').get(getUsers).post(createUser)
routerUsers.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)

module.exports = routerUsers