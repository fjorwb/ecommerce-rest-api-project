const {pool} = require('../dbConfig')

const getAllCarts = (request, response) => {
  pool.query('SELECT * FROM cart ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCartById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM cart WHERE id = $1', [id], (error, results) => {
    if(error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getCartByCartId = (request, response) => {
  const id = request.params.id
  console.log(id)

  pool.query('SELECT * FROM cart WHERE cart_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createCart = (request, response) => {
  const { 
      cart_id,
      user_id,
      product_id,
      quantity,
      date
    } = request.body

  pool.query('INSERT INTO cart (cart_id, user_id, product_id, quantity, date) VALUES ($1, $2, $3, $4, $5)', [
      cart_id,
      user_id,
      product_id,
      quantity,
      date
    ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Cart successfully added`)
  })
}

const updateCart = (request, response) => {
  const {prm1, prm2} = JSON.parse(request.params.id)
  const { 
      quantity,
      date
    } = request.body

  pool.query(
    'UPDATE cart SET quantity = $1, date = $2 WHERE cart_id = $3 AND product_id = $4 RETURNING *', 
    [
      quantity,
      date,
      prm1,
      prm2
    ],
    (error, ) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Cart id:${prm1} with product_id ${prm2} modified succesfully`)
    }
  )
}

const deleteCart = (request, response) => {
  const id = request.params.id
  console.log(id)

  pool.query('DELETE FROM cart WHERE cart_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Cart deleted with id: ${id}`)
  })
}

module.exports = {
  getAllCarts,
  getCartById,
  getCartByCartId,
  createCart,
  updateCart,
  deleteCart,
}