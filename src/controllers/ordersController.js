/* eslint-disable camelcase */
// const { pool } = require('../dbConfig')
const { db } = require('../dbConfig')

const Convert = require('../helpers/tableCodes')
const AccountNumber = require('../helpers/accountCode')

const date = Date.now()
const tax = 0.1

const getAllOrders = async (request, response) => {
  const results = await db.any('SELECT * FROM orders ORDER BY id ASC')

  if (results.length === 0) {
    response.status(404).send('No orders found')
  } else {
    response.status(200).json(results)
  }
}

const getOrderById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = `SELECT * FROM orders WHERE id = ${id}`
  const values = [id]

  const results = await db.any(statement, values)

  if (results.length === 0) {
    response.status(404).send('No order found')
  } else {
    response.status(200).json(results)
  }
}

const getOrdersByOrderId = async (request, response) => {
  const order_id = request.params.order_id

  const statement = 'SELECT * FROM orders WHERE order_id = $1'
  const values = [order_id]

  const results = await db.any(statement, values)
  if (results.length === 0) {
    response.status(404).send('No order found')
  } else {
    response.status(200).json(results)
  }
}

const createOrder = async (request, response) => {
  const cart_id = request.body.cart_id

  const accotype = '1'
  let order_id = ''
  let order_num = 0

  //  CHECK IF CART EXISTS
  const statement = ('SELECT * FROM cart WHERE cart_id = $1')
  const values = [cart_id]
  const temp = await db.any(statement, values)
  if (temp?.length === 0) {
    response.status(400).send(`not found cart with cart_id: ${cart_id}`) //  WHEN CARTS DOES NOT EXIST
  } else {
    const order = await db.any('SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1') //  WHEN CART EXIST

    //  GET NEXT ORDER_ID
    if (order?.length === 0) {
      order_num = 1
    } else {
      order_num = Number(order[0].order_id) + 1
      console.log(order_num)
      order_id = Convert(order_num)
      console.log('order_id::::::' + order_id)
    }

    // SELECT CART ITEMS TO CREATE ORDER
    console.log(cart_id)
    const statement1 = ('SELECT * FROM cart WHERE cart_id = $1')
    const values1 = [cart_id]
    const temp1 = await db.any(statement1, values1)

    console.log('..............................................')
    console.log(temp1)
    console.log(order_id)
    console.log('..............................................')

    //  CREATE ORDER
    for (let i = 0; i < temp1.length; i++) {
      const statement2 = ('INSERT INTO orders (order_id, product_id, quantity, price, discount, tax, date) VALUES ($1, $2, $3, $4, $5, $6, $7)')
      const values2 = [order_id, temp1[i].product_id, temp1[i].quantity, temp1[i].price, temp1[i].discount, tax, date]

      await db.any(statement2, values2)
    }

    // THEN CREATE AN ACCOUNT FOR THE ORDER

    // CALCULATE THE TOTAL AMOUNT OF THE ORDER
    let amount = 0
    for (let i = 0; i < temp1.length; i++) {
      amount = amount + (temp1[i].quantity * temp1[i].price * (1 - temp1[i].discount) * (1 + tax))
    }
    console.log(amount)

    // CREATE THE ACCOUNT_ID
    const account_id = AccountNumber(accotype, temp1[0].user_id)

    // CREATE THE ACCOUNT
    const statement4 = 'INSERT INTO accounts (account_id, user_id, order_id, amount, date, tax, accotype) VALUES($1, $2, $3, $4, $5, $6, $7)'
    const values4 = [account_id, temp1[0].user_id, order_id, amount, date, tax, accotype]

    await db.any(statement4, values4)

    // DELETE THE CART

    const statement3 = 'DELETE FROM cart WHERE cart_id = $1'
    const values3 = [cart_id]

    await db.any(statement3, values3)

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

  const statement = 'SELECT * FROM orders WHERE order_id = $1 AND product_id =$2'
  const values = [order_id, product_id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`not order found with id:${order_id} and product_id: ${product_id}`)
  } else {
    const statement = 'UPDATE orders SET quantity = $1, price = $2, discount = $3, tax = $4, date = $5 WHERE order_id = $6 AND product_id = $7 RETURNING *'
    const values = [quantity, price, discount, tax, date, order_id, product_id]

    const results = await db.any(statement, values)

    if (results.length === 0) {
      response.status(400).send(`not found order with id:${order_id} and product_id: ${product_id}`)
    } else {
      response.status(200).send(`Order id:${order_id} updated succesfully`)
    }
  }
}

const deleteOrder = async (request, response) => {
  const order_id = request.params.order_id
  console.log(order_id)

  const statement = 'SELECT * FROM orders WHERE order_id = $1'
  const values = [order_id]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    response.status(404).send(`not order found with order_id: ${order_id}`)
  } else {
    const statement = 'DELETE FROM orders WHERE order_id = $1'
    const values = [order_id]

    const results = await db.any(statement, values)
    if (results.length === 0) {
      response.status(400).send(`not found order with order_id: ${order_id}`)
    } else {
      response.status(200).send(`Order id:${order_id} deleted succesfully`)
    }
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByOrderId,
  createOrder,
  updateOrder,
  deleteOrder
}
