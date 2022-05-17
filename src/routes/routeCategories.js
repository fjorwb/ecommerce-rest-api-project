
const express = require('express')
const routerCategories = express.Router()

const {getCategories, getCategoryById, createCategory, updateCategory, deleteCategory} = require('../controllers/categoriesController')

routerCategories.route('/').get(getCategories).post(createCategory)
routerCategories.route('/:id').get(getCategoryById).put(updateCategory).delete(deleteCategory)

module.exports = routerCategories