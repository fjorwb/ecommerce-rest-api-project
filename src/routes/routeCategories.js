
const express = require('express')
const routerCategories = express.Router()

const authorization = require('../middlewares/authorization')

const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoriesController')

routerCategories.route('/')
  .get(authorization(['admin']), getCategories)
  .post(authorization(['admin']), createCategory)
routerCategories.route('/:id')
  .get(authorization(['admin', 'manager']), getCategoryById)
  .put(authorization(['admin']), updateCategory)
  .delete(authorization(['admin']), deleteCategory)

module.exports = routerCategories
