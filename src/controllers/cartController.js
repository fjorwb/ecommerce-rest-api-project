/* eslint-disable camelcase */
const { db } = require('../dbConfig')

const Convert = require('../helpers/tableCodes')

let cart_id = ''

const getAllCarts = async (request, response) => {
  try {
    const results = await db.any('SELECT * FROM cart ORDER BY cart_id, product_id')

    if (results?.length === 0) {
      response.status(404).send('no carts found')
    } else {
      response.status(200).json(results)
    }
  } catch (error) {
    throw new Error('Noooooo!!!!')
  }
}

const getCartById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM cart WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`no cart found with id:${id}`)
  } else {
    response.status(200).json(temp)
  }
}

const getCartByCartId = async (request, response) => {
  const { cart_id } = request.params

  const statement = `SELECT id, cart_id, user_id, product_id, quantity, price, discount, date 
                     FROM cart 
                     WHERE cart_id = $1
                     ORDER BY 2,4`
  const values = [cart_id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`no cart found with cart_id:${cart_id}`)
  } else {
    response.status(200).json(temp)
  }
}

const createCart = async (request, response) => {
  const { user_id, product_id, quantity, samecart } = request.body

  const date = Date.now()
  let cart_num = 0

  let price = 0
  let discount = 0

  let statement = ''
  let values = []

  // charge price & discount from products
  statement = 'SELECT price, discount FROM products WHERE product_id = $1'
  values = [product_id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`no product found with product_id:${product_id}`)
  }

  price = temp[0].price
  discount = temp[0].discount

  // check if is a new cart
  if (!samecart) {
    try {
      const cart = await db.one('SELECT cart_id FROM cart ORDER BY cart_id DESC LIMIT 1')

      if (cart?.length === 0) {
        cart_num = 1
      } else {
        cart_num = Number(cart.cart_id) + 1
      }
    } catch (error) {
      cart_num = 1
    }
  } else {
    const cart = await db.one('SELECT cart_id FROM cart ORDER BY cart_id DESC LIMIT 1')
    cart_num = Number(cart.cart_id)
  }

  cart_id = Convert(cart_num)

  statement = 'SELECT * FROM cart WHERE cart_id = $1'
  values = [cart_id]

  const results = await db.manyOrNone(statement, values)

  if (results?.length > 0) {
    const stat2 = 'SELECT * FROM cart WHERE cart_id = $1 AND product_id = $2'
    const valu2 = [cart_id, product_id]

    const res2 = await db.manyOrNone(stat2, valu2)

    if (res2?.length > 0) {
      const stat3 = `UPDATE cart SET quantity = $1, price = $2, discount = $3, date = $4 
                        WHERE cart_id = $5 AND product_id = $6`
      const valu3 = [quantity, price, discount, date, cart_id, product_id]

      const res3 = db.manyOrNone(stat3, valu3)

      if (res3?.length === 0) {
        response.status(400).send('no cart updated')
      }

      response.status(200).send(`cart with Id: ${cart_id} updated`)
    } else {
      const statement = `INSERT INTO cart (cart_id, user_id, product_id, quantity, price, discount, date) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`
      const values = [cart_id, user_id, product_id, quantity, price, discount, date]

      await db.any(statement, values)

      response.status(201).send(`product added to cart with Id: ${cart_id}`)
    }
  } else {
    const statement = `INSERT INTO cart (cart_id, user_id, product_id, quantity, price, discount, date) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`
    const values = [cart_id, user_id, product_id, quantity, price, discount, date]

    await db.any(statement, values)

    response.status(201).send(`cart with Id: ${cart_id} created`)
  }
  // return null
}

const updateCart = async (request, response) => {
  const { id } = request.params

  const { quantity } = request.body

  const date = Date.now()

  let statement = 'SELECT * FROM cart WHERE id = $1'
  let values = [id]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    response.status(404).send(`no cart found with id:${id}`)
  } else {
    statement = 'UPDATE cart SET quantity = $1, date = $2 WHERE id = $3'
    values = [quantity, date, id]

    await db.any(statement, values)

    response.status(200).send(`cart with Id: ${id} updated`)
  }
}

// const updateCart = async (request, response) => {
//   const {
//     cart_id,
//     product_id,
//     quantity
//   } = request.body

//   const date = Date.now()

//   const statement = ('SELECT * FROM cart WHERE cart_id = $1 AND product_id = $2')
//   const values = [cart_id, product_id]

//   const results = await db.any(statement, values)

//   if (results?.length === 0) {
//     response.status(404).send(`there is not cart with id_cart: ${cart_id} and product_id: ${product_id}`)
//   } else {
//     const statement = `UPDATE cart SET quantity = $1, date = $2
//                 WHERE cart_id = $3 AND product_id = $4`
//     const values = [quantity, date, cart_id, product_id]

//     await db.any(statement, values)

//     response.status(200).send(`cart with cart_id: ${cart_id} updated`)
//   }
// }

const deleteCartItem = async (request, response) => {
  const id = request.params.id

  const statement = 'SELECT FROM cart WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`no cart item found with id: ${id}`)
  } else {
    const statement = 'DELETE FROM cart WHERE id = $1'
    const values = [id]

    await db.any(statement, values)

    response.status(200).send(`deleted cart item with Id: ${id}`)
  }
}

const deleteAllCart = async (request, response) => {
  const { cart_id } = request.params
  // console.log(cart_id)

  const statement = 'SELECT * FROM cart WHERE cart_id = $1'
  const values = [cart_id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`no cart found with cart_id:${cart_id}`)
  } else {
    const statement = 'DELETE FROM cart WHERE cart_id = $1'
    const values = [cart_id]

    await db.any(statement, values)

    response.status(200).send(`deleted all cart with cart_id: ${cart_id}`)
  }
}

module.exports = {
  getAllCarts,
  getCartById,
  getCartByCartId,
  createCart,
  updateCart,
  deleteCartItem,
  deleteAllCart,
}
