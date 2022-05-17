const {pool} = require('../queries')

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProductById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createProduct = async (request, response) => {
  const { 
      product_id,
      product_name,
      product_description,
      product_price,
      product_unit,
      product_img
    } = request.body

  await pool.query('INSERT INTO products (product_id, product_name, product_description, product_price, product_unit, product_img) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
      product_id,
      product_name,
      product_description,
      product_price,
      product_unit,
      product_img
      ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Product successfully added with ID: ${results.rows[0].id}`)
  })
}

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id)
  const { 
      product_id,
      product_name,
      product_description,
      product_price,
      product_unit,
      product_img
    } = request.body

  pool.query(
    'UPDATE Products SET product_id = $1, product_name = $2, product_description = $3, product_price = $4, product_unit = $5, product_img = $6 WHERE id = $7', 
    [
      product_id,
      product_name,
      product_description,
      product_price,
      product_unit,
      product_img,
      id
    ],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Product modified with ID: ${id}`)
    }
  )
}

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM Products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Product deleted with ID: ${id}`)
  })
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}