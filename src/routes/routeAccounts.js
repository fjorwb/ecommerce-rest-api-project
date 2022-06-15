
const express = require('express')
const routerAccounts = express.Router()

const authorization = require('../middlewares/authorization')

const { getAccounts, getAccountById, createAccount, updateAccount, deleteAccount } = require('../controllers/accountsController')

routerAccounts.route('/')
  .get(authorization(['admin', 'manager']), getAccounts)
  .post(authorization(['admin', 'manager']), createAccount)
routerAccounts.route('/:id')
  .get(authorization(['admin', 'manager', 'user']), getAccountById)
  .put(authorization(['admin']), updateAccount)
  .delete(authorization(['admin']), deleteAccount)

module.exports = routerAccounts
