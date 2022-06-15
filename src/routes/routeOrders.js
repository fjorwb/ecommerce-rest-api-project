
const express = require('express')
const routerOrders = express.Router()

const authorization = require('../middlewares/authorization')

const { getAllOrders, getOrderById, getOrdersByOrderId, createOrder, updateOrder, deleteOrder } = require('../controllers/ordersController')

routerOrders.route('/')
  .get(authorization(['admin', 'manager']), getAllOrders)
  .post(authorization(['admin', 'manager']), createOrder)
  .put(authorization(['admin', 'manager']), updateOrder)
routerOrders.route('/:id')
  .get(authorization(['admin', 'manager']), getOrderById)
  .delete(authorization(['admin', 'manager']), deleteOrder)
routerOrders.route('/order/:order_id')
  .get(authorization(['admin', 'manager']), getOrdersByOrderId)

module.exports = routerOrders
