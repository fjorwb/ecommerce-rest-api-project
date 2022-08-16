/* eslint-disable camelcase */
const { db } = require('../dbConfig')

const getCategories = async (request, response) => {
  const results = await db.any('SELECT * FROM categories ORDER BY category_id ASC')

  response.status(200).json(results)
}

const getCategoryById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM categories WHERE id = $1'
  const values = [id]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    response.status(404).send(`no category found with id:${id}`)
  } else {
    response.status(200).json(results)
  }
}

const createCategory = async (request, response) => {
  const {
    category_id,
    category_name,
    category_description
  } = request.body

  const statement = 'SELECT * FROM categories WHERE category_id = $1'
  const values = [category_id]

  const temp = await db.any(statement, values)

  if (temp?.length > 0) {
    response.status(400).send(`category with category_id: ${category_id} already exists`)
  } else {
    const statement = `INSERT INTO categories (category_id, category_name, category_description) 
                         VALUES ($1, $2, $3) RETURNING *`
    const values = [category_id, category_name, category_description]

    await db.any(statement, values)

    response.status(201).send(`Category successfully added WITH id: ${category_id}`)
  }
}

const updateCategory = async (request, response) => {
  const id = request.params.id

  const {
    category_id,
    category_name,
    category_description
  } = request.body

  const statement = 'SELECT * FROM categories WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`not found category with id: ${id}`)
  } else {
    const statement = 'UPDATE categories SET category_id = $1, category_name = $2, category_description = $3 WHERE id = $4'
    const values = [category_id, category_name, category_description, id]

    await db.any(statement, values)

    response.status(400).send(`category modified with Id: ${id}`)
  }
}

const deleteCategory = async (request, response) => {
  const id = request.params.id

  const statement = 'SELECT * FROM categories WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`not found category with id: ${id}`)
  } else {
    const statement = 'DELETE FROM categories WHERE id = $1'
    const values = [id]

    await db.any(statement, values)

    response.status(400).send(`category deleted with Id: ${id}`)
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}
