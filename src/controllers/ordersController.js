/* eslint-disable camelcase */
const { pool } = require('../dbConfig')
const { db } = require('../dbConfig')

const Convert = require('../helpers/tableCodes')

const date = Date.now()
const tax = 0.1

let order_num = 0
let order_id = ''

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
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOrdersByOrderId = (request, response) => {
  const order_id = request.params.order_id

  pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createOrder = async (request, response) => {
  const cart_id = request.body.cart_id

  const statement = ('SELECT * FROM cart WHERE cart_id = $1')
  const values = [cart_id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(400).send(`not found cart with cart_id: ${cart_id}`)
  } else {
    const order = await db.any('SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1')

    if (order?.length === 0) {
      order_num = 1
    } else {
      order_num = Number(order[0].order_id) + 1
    }

    order_id = Convert(order_num)

    const statement = ('SELECT * FROM cart WHERE cart_id = $1')
    const values = [cart_id]

    const temp = await db.any(statement, values)

    for (let i = 0; i < temp.length; i++) {
      pool.query(`INSERT INTO orders (
              order_id, 
              cart_id,
              user_id,
              product_id,
              quantity,
              price,
              discount,
              tax,
              date
              )
              VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        order_id,
        cart_id,
        temp[i].user_id,
        temp[i].product_id,
        temp[i].quantity,
        temp[i].price,
        temp[i].discount,
        tax,
        date
      ])
    }

    response.status(201).send(`order created with id: ${order_id}`)
  }
}

const updateOrder = async (request, response) => {
  const {
    order_id,
    product_id,
    quantity,
    price,
    discount,
    tax,
    date
  } = request.body

  const statement = (`SELECT * FROM orders 
                        WHERE order_id = $1 AND product_id =$2`)
  const values = [order_id, product_id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`not order found with id:${order_id} and product_id: ${product_id}`)
  } else {
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
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`Order id:${order_id} with product_id ${product_id} modified succesfully`)
      }
    )
  }
}

const deleteOrder = (request, response) => {
  const id = request.params.id
  console.log(id)

  pool.query('DELETE FROM orders WHERE order_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Order deleted with id: ${id}`)
  })
}

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByOrderId,
  createOrder,
  updateOrder,
  deleteOrder
}
