
const express = require('express')
const routerAccounts = express.Router()

const { getAccounts, getAccountById, createAccount, updateAccount, deleteAccount } = require('../controllers/accountsController')

routerAccounts.route('/').get(getAccounts).post(createAccount)
routerAccounts.route('/:id').get(getAccountById).put(updateAccount).delete(deleteAccount)

module.exports = routerAccounts
