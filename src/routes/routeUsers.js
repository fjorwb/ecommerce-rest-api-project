
const express = require('express')
const routerUsers = express.Router()

const {getAllUsers, getUserById, getUserByUserName, updateUser, deleteUser} = require('../controllers/usersController')

routerUsers.route('/').get(getAllUsers)
routerUsers.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)
routerUsers.route('/user/:name').get(getUserByUserName)

module.exports = routerUsers