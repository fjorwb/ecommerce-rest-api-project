/* eslint-disable camelcase */
const { db } = require('../dbConfig')

const Convert = require('../helpers/tableCodes')
const AccountNumber = require('../helpers/accountCode')

const accotype = '1'

const Checkout = async (request, response) => {
  const { cart_id } = request.params

  const date = Date.now()
  const tax = 0.05

  let order_num = 0
  let order_id = ''

  if (!cart_id) {
    response.status(400).send('please enter valid cart_id')
  } else {
    // get cart
    const cart = await db.any('SELECT * FROM cart WHERE cart_id = $1', [cart_id])

    if (cart?.length === 0) {
      response.status(404).send(`no cart with cart_id: ${cart_id}`)
    } else {
    // check orders for orders_id
      const orders = await db.any('SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1')

      console.log('orders.........' + orders)

      if (orders?.length === 0) {
        console.log('1a - orders.order_id:::: ' + orders.order_id)
        order_num = 1
      } else {
        console.log('1b - orders.order_id:::: ' + orders[0].order_id)

        order_num = Number(orders[0].order_id) + 1
        console.log('1b1 - orders_num:::: ' + orders[0].order_id)
      }

      order_id = Convert(order_num)

      // SELECT CART ITEMS TO CREATE ORDER
      console.log('2 -cart_id:::::' + cart_id)
      const statement1 = ('SELECT * FROM cart WHERE cart_id = $1')
      const values1 = [cart_id]

      const temp1 = await db.any(statement1, values1)

      //  CREATE ORDER
      for (let i = 0; i < temp1.length; i++) {
        const statement2 = (`INSERT INTO orders (
        order_id, 
        user_id, 
        cart_id, 
        product_id, 
        quantity, 
        price, 
        discount, 
        tax, 
        date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`)

        const values2 = [
          order_id,
          temp1[i].user_id,
          temp1[i].cart_id,
          temp1[i].product_id,
          temp1[i].quantity,
          temp1[i].price,
          temp1[i].discount,
          tax,
          date
        ]

        await db.any(statement2, values2)
      }
      // CALCULATE THE TOTAL AMOUNT OF THE ORDER
      let amount = 0
      for (let i = 0; i < temp1.length; i++) {
        amount = amount + (temp1[i].quantity * temp1[i].price * (1 - temp1[i].discount) * (1 + tax))
      }
      console.log('3. amount::::::::::' + amount)

      // CREATE THE ACCOUNT_ID
      const account_id = AccountNumber(accotype, temp1[0].user_id)

      // CREATE THE ACCOUNT
      const statement3 = 'INSERT INTO accounts (account_id, user_id, order_id, amount, date, tax, acco_type) VALUES($1, $2, $3, $4, $5, $6, $7)'
      const values3 = [account_id, temp1[0].user_id, order_id, amount, date, tax, accotype]

      await db.any(statement3, values3)

      const statement4 = ('DELETE FROM cart WHERE cart_id = $1')
      const values4 = [cart_id]

      await db.any(statement4, values4)

      response.status(201).send('order was created')
    }
  }
  // return null
}

module.exports = { Checkout }
