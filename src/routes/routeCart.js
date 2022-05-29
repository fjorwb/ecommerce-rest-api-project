
const express = require('express')
const routerCart = express.Router()

const {getAllCarts, getCartById, getCartByCartId, getCartById2, createCart, updateCart, deleteCart} = require('../controllers/cartController')

routerCart.route('/').get(getAllCarts).post(createCart).put(updateCart)
routerCart.route('/:id').get(getCartById).delete(deleteCart)
routerCart.route('/db/:id').get(getCartById2)
routerCart.route('/cart/:id').get(getCartByCartId)

module.exports = routerCart