/* eslint-disable camelcase */
const { pool } = require('../dbConfig')
const { db } = require('../dbConfig')

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY product_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProductById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = ('SELECT * FROM products WHERE id = $1')
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    return response.status(404).send(`no product found with id: ${id}`)
  } else {
    pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
}

const getProductByCategoryId = (request, response) => {
  const category_id = request.params.category_id

  pool.query('SELECT * FROM products WHERE substring(product_id,1,4) = $1 ORDER BY product_id',
    [category_id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const createProduct = async (request, response) => {
  const {
    product_id,
    name,
    description,
    price,
    unit,
    discount,
    img
  } = request.body

  await pool.query('INSERT INTO products (product_id, name, description, price, unit, discount, img) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
    product_id,
    name,
    description,
    price,
    unit,
    discount,
    img
  ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Product successfully added with ID: ${results.rows[0].id}`)
  })
}

const updateProduct = async (request, response) => {
  const id = parseInt(request.params.id)
  const {
    product_id,
    name,
    description,
    unit,
    price,
    discount,
    img
  } = request.body

  if (!id) {
    return response.status(400).send('please enter a valid id')
  }

  const statement = ('SELECT * FROM products WHERE id = $1')
  const values = [id]

  const temp = await db.any(statement, values)
  if (temp?.length === 0) {
    return response.status(404).send(`no product found with id:${id}`)
  } else {
    pool.query(
      'UPDATE products SET product_id = $1, name = $2, description = $3, unit = $4, price = $5, discount = $6, img = $7 WHERE id = $8',
      [
        product_id,
        name,
        description,
        unit,
        price,
        discount,
        img,
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
}

const deleteProduct = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = '(SELECT * from products WHERE id = $1)'
  const values = [id]

  const data = await db.any(statement, values)

  if (data?.length === 0) {
    return response.status(404).send(`not product found with id:${id}`)
  }

  pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }

    return response.status(200).send(`Product deleted with ID: ${id}`)
  })
}

module.exports = {
  getProducts,
  getProductById,
  getProductByCategoryId,
  createProduct,
  updateProduct,
  deleteProduct
}
