
const express = require('express')
const routerCart = express.Router()

const authorization = require('../middlewares/authorization')

const { getAllCarts, getCartById, getCartByCartId, createCart, updateCart, deleteCartItem, deleteAllCart } = require('../controllers/cartController')

routerCart.route('/')
  .get(authorization(['admin', 'manager']), getAllCarts)
  .post(authorization(['admin', 'manager', 'user']), createCart).put(updateCart)
routerCart.route('/:id')
  .get(authorization(['admin', 'manager', 'user']), getCartById)
  .delete(authorization(['admin', 'manager', 'user']), deleteCartItem)
routerCart.route('/cart/:cart_id')
  .get(authorization(['admin', 'manager', 'user']), getCartByCartId)
  .delete(authorization(['admin']), deleteAllCart)

module.exports = routerCart
