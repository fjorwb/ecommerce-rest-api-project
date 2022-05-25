
const express = require('express')
const routerUsers = express.Router()

const {getAllUsers, getUserById, createUser, updateUser, deleteUser} = require('../controllers/usersController')

routerUsers.route('/').get(getAllUsers).post(createUser)
routerUsers.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)

module.exports = routerUsers