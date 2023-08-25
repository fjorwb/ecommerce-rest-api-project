const express = require('express')
const routerAddresses = express.Router()

const authorization = require('../middlewares/authorization')

const {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressesController')

routerAddresses
  .route('/')
  .get(authorization(['admin', 'manager', 'user']), getAllAddresses)
  .post(authorization(['admin']), createAddress)
routerAddresses
  .route('/:id')
  .get(authorization(['admin', 'manager', 'user']), getAddressById)
  .put(authorization(['admin']), updateAddress)
  .delete(authorization(['admin']), deleteAddress)

module.exports = routerAddresses
