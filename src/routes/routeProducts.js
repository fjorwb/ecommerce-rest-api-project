
const express = require('express')
const routerProducts = express.Router()

const {getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/ProductsController')

routerProducts.route('/').get(getProducts).post(createProduct)
routerProducts.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct)

module.exports = routerProducts