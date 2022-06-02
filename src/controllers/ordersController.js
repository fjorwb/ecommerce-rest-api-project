const {pool} = require('../dbConfig')

const getAllOrders = (request, response) => {
  pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getOrderById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if(error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOrdersByOrderId = (request, response) => {
  console.log(request.params.ix)
  const ix = request.params.ix
  console.log(ix)

  pool.query('SELECT * FROM orders WHERE order_id = $1', [ix], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createOrder = (request, response) => {
  const { 
      order_id,
      user_id,
      cart_id,
      account_id,
      product_id,
      quantity,
      price,
      discount,
      tax,
      date
    } = request.body

  pool.query('INSERT INTO orders (order_id, user_id, cart_id, account_id, product_id, quantity, price, discount, tax, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [
      order_id,
      product_id,
      quantity,
      price,
      discount,
      tax,
      date
    ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Cart successfully added`)
  })
}

const updateOrder = (request, response) => {
  const {
      order_id,
      product_id,
      quantity,
      price,
      discount,
      tax,
      date
    } = request.body

  pool.query(
    'UPDATE orders SET quantity = $1, price = $2, discount = $3, tax = $4, date = $5 WHERE order_id = $6 AND product_id = $7 RETURNING *', 
    [
      quantity,
      price,
      discount,
      tax,
      date,
      order_id,
      product_id
    ],
    (error, ) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Order id:${order_id} with product_id ${product_id} modified succesfully`)
    }
  )
}

const deleteOrder = (request, response) => {
  const id = request.params.id
  console.log(id)

  pool.query('DELETE FROM orders WHERE order_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Cart deleted with id: ${id}`)
  })
}

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByOrderId,
  createOrder,
  updateOrder,
  deleteOrder,
}