/* eslint-disable camelcase */
const { db } = require('../dbConfig')

const getAllProducts = async (request, response) => {
  const results = await db.any('SELECT * FROM products ORDER BY product_id ASC')

  response.status(200).json(results)
}

const getProductById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM products WHERE id = $1'
  const values = [id]

  const results = await db.any(statement, values)
  // console.log(results.user_id)

  if (results?.length === 0) {
    return response.status(404).send(`no product found with id: ${id}`)
  } else {
    response.status(200).json(results)
  }
}

const getProductByCategoryId = async (request, response) => {
  const category_id = request.params.category_id

  const statement =
    'SELECT * FROM products WHERE substring(product_id,1,4) = $1 ORDER BY product_id'
  const values = [category_id]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    response.status(404).send(`not category/product found with id:${category_id}`)
  } else {
    response.status(200).json(results)
  }
}

const createProduct = async (request, response) => {
  const { product_id, name, description, price, unit, discount, img } = request.body

  const statement = 'SELECT * FROM products WHERE product_id = $1'
  const values = [product_id]

  const temp = await db.any(statement, values)

  if (temp?.length > 0) {
    response.status(400).send(`product with product id: ${product_id} already exist`)
  } else {
    const statement =
      'INSERT INTO products (product_id, name, description, price, unit, discount, img) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    const values = [product_id, name, description, price, unit, discount, img]

    await db.any(statement, values)

    response.status(201).send(`Product successfully added with ID: ${product_id}`)
  }
}

const updateProduct = async (request, response) => {
  const id = parseInt(request.params.id)
  const { product_id, name, description, unit, price, discount, img } = request.body

  if (!id) {
    return response.status(400).send('please enter a valid id')
  }

  const statement = 'SELECT * FROM products WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)
  if (temp?.length === 0) {
    return response.status(404).send(`no product found with id:${id}`)
  } else {
    const statement =
      'UPDATE products SET product_id = $1, name = $2, description = $3, unit = $4, price = $5, discount = $6, img = $7 WHERE id = $8'
    const values = [product_id, name, description, unit, price, discount, img, id]

    await db.any(statement, values)

    response.status(200).send(`Product modified with ID: ${id}`)
  }
}

const deleteProduct = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = '(SELECT * from products WHERE id = $1)'
  const values = [id]

  const data = await db.any(statement, values)

  if (data?.length === 0) {
    return response.status(404).send(`not product found with id:${id}`)
  } else {
    const statement = 'DELETE FROM products WHERE id = $1'
    const values = [id]

    await db.any(statement, values)

    response.status(200).send(`Product deleted with ID: ${id}`)
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductByCategoryId,
  createProduct,
  updateProduct,
  deleteProduct,
}
