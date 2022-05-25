const {pool} = require('../dbConfig')

const getCategories = (request, response) => {
  pool.query('SELECT * FROM categories ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCategoryById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM categories WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createCategory = async (request, response) => {
  const { 
      category_id,
      category_name,
      category_description
    } = request.body

  await pool.query('INSERT INTO categories (category_id, category_name, category_description) VALUES ($1, $2, $3) RETURNING *', [category_id, category_name, category_description], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Category successfully added WITH id: ${results.rows[0].id}`)
  })
}

const updateCategory = (request, response) => {
  const id = parseInt(request.params.id)
  const { 
      category_id,
      category_name,
      category_description
    } = request.body

  pool.query(
    'UPDATE categories SET category_id = $1, category_name = $2, category_description = $3 WHERE id = $4', 
    [
      category_id, 
      category_name,
      category_description,
      id
    ],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Category modified with ID: ${id}`)
    }
  )
}

const deleteCategory = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM categories WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Category deleted with ID: ${id}`)
  })
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}