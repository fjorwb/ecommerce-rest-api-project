const { db } = require('../dbConfig')

const getAllPaymentMethods = async (request, response) => {
  const results = await db.any('SELECT * FROM paymentmethods ORDER BY payment_id ASC')

  response.status(200).json(results)
}

const getPaymentMethodById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM paymentmethods WHERE id = $1'
  const values = [id]

  const results = await db.any(statement, values)
  // console.log(results.user_id)

  if (results?.length === 0) {
    return response.status(404).send(`no payment method found with id: ${id}`)
  } else {
    response.status(200).json(results)
  }
}

const createPaymentMethod = async (request, response) => {
  const {
    payment_id,
    user_id,
    payment_method,
    card_provider,
    card_number,
    card_holder,
    expiration_date,
    cvv,
    default_payment,
  } = request.body

  const statement = 'SELECT * FROM paymentmethods WHERE payment_id = $1'
  const values = [payment_id]

  const temp = await db.any(statement, values)

  if (temp?.length > 0) {
    response.status(400).send(`payment method with payment method id: ${payment_id} already exist`)
  } else {
    const statement =
      'INSERT INTO paymentmethods (payment_id, user_id, card_number, card_type, expiration_date, security_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    const values = [
      payment_id,
      user_id,
      payment_method,
      card_provider,
      card_number,
      card_holder,
      expiration_date,
      cvv,
      default_payment,
    ]

    const results = await db.any(statement, values)

    response.status(201).json(results)
  }
}

const updatePaymentMethod = async (request, response) => {
  const id = parseInt(request.params.id)
  const {
    payment_id,
    user_id,
    payment_method,
    card_provider,
    card_number,
    card_holder,
    expiration_date,
    cvv,
    default_payment,
  } = request.body

  if (!id) {
    return response.status(400).send('id must be included in request')
  }

  const statement = 'SELECT * FROM paymentmethods WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)
  if (temp?.length === 0) {
    return response.status(404).send(`no payment method found with id: ${id}`)
  } else {
    const statement =
      'UPDATE paymentmethods SET payment_id = $1, user_id = $2, card_number = $3, card_type = $4, expiration_date = $5, security_code = $6 WHERE id = $7 RETURNING *'
    const values = [
      payment_id,
      user_id,
      payment_method,
      card_provider,
      card_number,
      card_holder,
      expiration_date,
      cvv,
      default_payment,
    ]

    await db.any(statement, values)

    response.status(200).send(`payment method with id: ${id} updated`)
  }
}

const deletePaymentMethod = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM paymentmethods WHERE id = $1'
  const values = [id]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    return response.status(404).send(`no payment method found with id: ${id}`)
  } else {
    const statement = 'DELETE FROM paymentmethods WHERE id = $1'
    const values = [id]

    await db.any(statement, values)

    response.status(200).send(`payment method with id: ${id} deleted`)
  }
}

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
}
