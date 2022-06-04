
const express = require('express')
const routerProducts = express.Router()

const {getProducts, getProductById, getProductByCategoryId, createProduct, updateProduct, deleteProduct} = require('../controllers/productsController')

routerProducts.route('/').get(getProducts).post(createProduct)
routerProducts.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct)
routerProducts.route('/category/:category_id').get(getProductByCategoryId)

module.exports = routerProducts