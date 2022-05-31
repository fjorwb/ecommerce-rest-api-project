
const express = require('express')
const routerProducts = express.Router()

const {getProducts, getProductById, getProductByCategoryId, createProduct, updateProduct, deleteProduct} = require('../controllers/ProductsController')

routerProducts.route('/').get(getProducts).post(createProduct)
routerProducts.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct)
routerProducts.route('/category/:id').get(getProductByCategoryId)

module.exports = routerProducts