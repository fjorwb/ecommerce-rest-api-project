const express = require('express')
const routerPaymentmethods = express.Router()

const authorization = require('../middlewares/authorization')

const {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require('../controllers/paymentmethodsController')

routerPaymentmethods
  .route('/')
  .get(authorization(['admin', 'manager', 'user']), getAllPaymentMethods)
  .post(authorization(['admin', 'manager', 'user']), createPaymentMethod)
routerPaymentmethods
  .route('/:id')
  .get(authorization(['admin', 'manager', 'user']), getPaymentMethodById)
  .put(authorization(['admin', 'manager', 'user']), updatePaymentMethod)
  .delete(authorization(['admin', 'manager', 'user']), deletePaymentMethod)

module.exports = routerPaymentmethods
