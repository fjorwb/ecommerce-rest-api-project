
const express = require('express')
const routerProducts = express.Router()

const authorization = require('../middlewares/authorization')

const { getAllProducts, getProductById, getProductByCategoryId, createProduct, updateProduct, deleteProduct } = require('../controllers/productsController')

routerProducts.route('/')
  .get(authorization(['admin', 'manager', 'user']), getAllProducts)
  .post(authorization(['admin']), createProduct)
routerProducts.route('/:id')
  .get(authorization(['admin', 'manager', 'user']), getProductById)
  .put(authorization(['admin']), updateProduct)
  .delete(authorization(['admin']), deleteProduct)
routerProducts.route('/category/:category_id')
  .get(authorization(['admin', 'manager', 'user']), getProductByCategoryId)

module.exports = routerProducts
