/* eslint-disable camelcase */
const { pool } = require('../dbConfig')
const { db } = require('../dbConfig')

const Convert = require('../helpers/tableCodes')

const Checkout = async (request, response) => {
  const { cart_id } = request.body

  const date = Date.now()
  const tax = 0.05

  let order_num = 0
  let order_id = ''

  if (!cart_id) {
    response.status(400).send('please enter valid cart id')
  }

  // get cart
  const cart = await db.manyOrNone('SELECT * FROM cart WHERE cart_id = $1', [cart_id])

  if (cart?.length === 0) {
    response.status(404).send(`no cart with cart_id: ${cart_id}`)
  } else {
    // check orders for orders_id
    const orders = await db.one('SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1')

    if (orders?.length === 0) {
      order_num = 0
    } else {
      order_num = Number(orders.order_id) + 1
    }

    order_id = Convert(order_num)

    for (let i = 0; i < cart.length; i++) {
      const { product_id, user_id, quantity } = cart[i]
      const dataprod = await db.one('SELECT price, discount FROM products WHERE product_id = $1', [product_id])

      const statement = (`INSERT INTO orders (
                    order_id,
                    cart_id, 
                    user_id, 
                    product_id, 
                    quantity, 
                    price, 
                    discount, 
                    tax, 
                    date) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`)

      const values = [order_id, cart_id, user_id, product_id, quantity, dataprod.price, dataprod.discount, tax, date]

      pool.query(statement, values, (error, results) => {
        if (error) {
          throw error
        }
      })
    }
    response.status(201).send('order was created')
  }

  return null
}

module.exports = { Checkout }
