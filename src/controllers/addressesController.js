const { db } = require('../dbConfig')

const getAllAddresses = async (request, response) => {
  const results = await db.any('SELECT * FROM addresses ORDER BY address_id ASC')

  response.status(200).json(results)
}

const getAddressById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM addresses WHERE id = $1'
  const values = [id]

  const results = await db.any(statement, values)
  // console.log(results.user_id)

  if (results?.length === 0) {
    return response.status(404).send(`no address found with id: ${id}`)
  } else {
    response.status(200).json(results)
  }
}

const createAddress = async (request, response) => {
  const {
    address_id,
    user_id,
    street,
    number,
    interior,
    city,
    state,
    zip_code,
    country,
    phone,
    default_address,
  } = request.body

  const statement = 'SELECT * FROM addresses WHERE address_id = $1'
  const values = [address_id]

  const temp = await db.any(statement, values)

  if (temp?.length > 0) {
    response.status(400).send(`address with address id: ${address_id} already exist`)
  } else {
    const statement =
      'INSERT INTO addresses (address_id, user_id, street, number, interior, city, state, zip, country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    const values = [
      address_id,
      user_id,
      street,
      number,
      interior,
      city,
      state,
      zip_code,
      country,
      phone,
      default_address,
    ]

    const results = await db.any(statement, values)

    response.status(201).json(results)
  }
}

const updateAddress = async (request, response) => {
  const id = parseInt(request.params.id)
  const {
    address_id,
    user_id,
    street,
    number,
    interior,
    city,
    state,
    zip_code,
    country,
    phone,
    delivery_instructions,
    default_address,
  } = request.body

  if (!id) {
    return response.status(400).send('id must be included in request')
  }

  const statement = 'SELECT * FROM addresses WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)
  if (temp?.length === 0) {
    return response.status(404).send(`no address found with id: ${id}`)
  } else {
    const statement =
      'UPDATE addresses SET address_id = $1, user_id = $2, street = $3, city = $4, state = $5, zip = $6, country = $7 WHERE id = $8 RETURNING *'
    const values = [
      address_id,
      user_id,
      street,
      number,
      interior,
      city,
      state,
      zip_code,
      country,
      phone,
      delivery_instructions,
      default_address,
    ]

    await db.any(statement, values)

    response.status(200).send(`address with id: ${id} updated`)
  }
}

const deleteAddress = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM addresses WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    return response.status(404).send(`no address found with id: ${id}`)
  } else {
    const statement = 'DELETE FROM addresses WHERE id = $1'
    const values = [id]

    await db.any(statement, values)

    response.status(200).send(`address with id: ${id} deleted`)
  }
}

module.exports = { getAllAddresses, getAddressById, createAddress, updateAddress, deleteAddress }
