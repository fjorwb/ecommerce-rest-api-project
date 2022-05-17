
const express = require('express')
const routerOrders = express.Router()

const {getAllOrders, getOrderById, getOrdersByOrderId, createOrder, updateOrder, deleteOrder} = require('../controllers/ordersController')

routerOrders.route('/').get(getAllOrders).post(createOrder)
routerOrders.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder)
routerOrders.route('/order/:id').get(getOrdersByOrderId)

module.exports = routerOrders