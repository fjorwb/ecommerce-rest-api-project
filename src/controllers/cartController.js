const {pool} = require('../dbConfig')
const {db} = require('../dbConfig')

const Convert = require('../helpers/tableCodes')


const getAllCarts = async (request, response) => {
  try {
    const results = await db.any('SELECT * FROM cart')

    response.status(200).json(results)
    
  } catch (error) {
    throw new Error('Noooooo!!!!')
  }
}

// const getAllCarts = (request, response) => {
//   pool.query('SELECT * FROM cart ORDER BY id ASC', (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).json(results.rows)
//   })
// }

const getCartById = (request, response) => {
  const id = parseInt(request.params.id)
    pool.query('SELECT * FROM cart WHERE id = $1', [id], (error, results) => {
      if(error) {
        throw error
      }
      if(results.rows.length === 0) {
        response.status(404).send(`there is not cart with Id: ${id}`)
      } else {
        response.status(200).json(results.rows)
      }
    }
  )
}

const getCartByCartId = async (request, response) => {
  const id = request.params.id

  pool.query(`
  SELECT id, cart_id, user_id, product_id, quantity, date
  FROM cart WHERE cart_id = $1`, 
  [id], 
  (error, results) => {
    if (error) {
      throw error
    }

    if(results.rows.length === 0) {
      response.status(404).send(`there is not cart with Id: ${id}`)
    } else {
        response.status(200).json(results.rows)
      }
    }
  )
}

const createCart = async (request, response) => {
  const {
    user_id,
    product_id,
    quantity,
    samecart
  } = request.body

  date = Date.now()
  cart_num = 0

  console.log(user_id, product_id, quantity, date )

  if(!samecart) {
  try {
    const cart = await db.one('SELECT cart_id FROM cart ORDER BY cart_id DESC LIMIT 1')

    console.log(cart);

    if(cart?.length === 0) {
      cart_num = 1
    } else {
      cart_num = Number(cart.cart_id) +1
    }
    
  } catch (error) {
    cart_num = 1
  }
 } else {
    const cart = await db.one('SELECT cart_id FROM cart ORDER BY cart_id DESC LIMIT 1')
      cart_num = Number(cart.cart_id)
  }

  console.log('dsadads',cart_num)

  cart_id = Convert(cart_num)
  console.log(cart_id)

  try {
    const statement = ('SELECT * FROM cart WHERE cart_id = $1')
    const values = [cart_id]

    const results = await db.manyOrNone(statement, values)

    console.log(results);

    if(results?.length > 0) {
      const stat2 = ('SELECT * FROM cart WHERE cart_id = $1 AND product_id = $2')
      const valu2 = [cart_id, product_id]

      const res2 = await db.manyOrNone(stat2, valu2)

      if(res2?.length > 0) {
        console.log(res2)
        const stat3 = (`UPDATE cart SET quantity = $1, date = $2 
                        WHERE cart_id = $3 AND product_id = $4`)
        const valu3 = [quantity, date, cart_id, product_id]

        const res3 = db.manyOrNone(stat3, valu3)

        response.status(200).send(`cart with Id: ${cart_id} updated`)

      } else {
        pool.query(`INSERT INTO cart (cart_id, user_id, product_id, quantity, date) 
                    VALUES ($1, $2, $3, $4, $5)`,
                    [cart_id, user_id, product_id, quantity, date])

        response.status(201).send(`product added to cart with Id: ${cart_id}`)
      }
    } else {
        pool.query(`INSERT INTO cart (cart_id, user_id, product_id, quantity, date) 
                    VALUES ($1, $2, $3, $4, $5)`,
                    [cart_id, user_id, product_id, quantity, date])

        response.status(201).send(`cart with Id: ${cart_id} created`)
    }
    return null

  } catch (error) {
    throw error
  }
}

const updateCart = async (request, response) => {
  const {
    cart_id, 
    product_id,
    quantity
  } = request.body

  const date = Date.now()

  const statement = (`SELECT * FROM cart WHERE cart_id = $1 AND product_id = $2`)
  const values = [cart_id, product_id]

  const results = await db.any(statement, values)

  if(results?.length === 0) {
    response.status(404).send(`there is not cart with id_cart: ${cart_id} and product_id: ${product_id}`)
  } else {
    pool.query(`UPDATE cart SET quantity = $1, date = $2 
                WHERE cart_id = $3 AND product_id = $4`,
                [quantity, date, cart_id, product_id], 
                (error, results) => {
                  if (error) {
                    throw error
                  }
                  response.status(200).send(`cart with cart_id: ${cart_id} updated`)
                }
              )
  }
}


// const updateCart = (request, response) => {
//   const {prm1, prm2} = JSON.parse(request.params.ix)

//   const {quantity} = request.body
  
//   const date = Date.now()

//   pool.query(`UPDATE cart SET quantity = $1, date = $2 
//               WHERE cart_id = $3 AND product_id = $4 RETURNING *`, 
//               [quantity, date, prm1, prm2], 
//               (error, results ) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).send(`Cart id:${prm1} with product_id ${prm2} modified succesfully`)
//     }
//   )
// }

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

const getCartById2 = async (request, response) => {
  const id = request.params.id
  try {
    const statement = ('SELECT * FROM cart WHERE id = $1')
    const values = [id]

    const results = await db.manyOrNone(statement, values)

    if(results?.length === 0) {
        response.status(404).send(`there is not cart with Id: ${id}`)
    } else {
        response.status(200).send(results)
    }

  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllCarts,
  getCartById,
  getCartById2,
  getCartByCartId,
  createCart,
  updateCart,
  deleteCart
}