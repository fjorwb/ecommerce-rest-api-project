
const express = require('express')
const routerCart = express.Router()

const {getAllCarts, getCartById, getCartByCartId, createCart, updateCart, deleteCart} = require('../controllers/cartController')

routerCart.route('/').get(getAllCarts).post(createCart)
routerCart.route('/:id').get(getCartById).put(updateCart).delete(deleteCart)
routerCart.route('/cart/:id').get(getCartByCartId)

module.exports = routerCart