
const express = require('express')
const routerOrders = express.Router()

const { getAllOrders, getOrderById, getOrdersByOrderId, createOrder, updateOrder, deleteOrder } = require('../controllers/ordersController')

routerOrders.route('/').get(getAllOrders).post(createOrder).put(updateOrder)
routerOrders.route('/:id').get(getOrderById).delete(deleteOrder)
routerOrders.route('/order/:order_id').get(getOrdersByOrderId)

module.exports = routerOrders
