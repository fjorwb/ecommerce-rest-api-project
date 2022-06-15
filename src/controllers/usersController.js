const { db } = require('../dbConfig')

// get all users
const getAllUsers = async (request, response) => {
  const results = await db.any('SELECT * FROM users ORDER BY id ASC')

  response.status(200).json(results)
}

// get an user by id
const getUserById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM users WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    return response.status(404).send(`no user found with id:${id}`)
  } else {
    const statement = 'SELECT * FROM users WHERE id = $1'
    const values = [id]

    const results = await db.any(statement, values)

    response.status(200).json(results)
  }
}

// update user
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  if (!name || !email) {
    return response.status(400).send('request.body is missing/incomplete. Check request.body')
  }

  const statement = 'UPDATE users SET name = $1, email = $2 WHERE id = $3'
  const values = [name, email, id]

  await db.any(statement, values)

  response.status(200).send(`User modified with ID: ${id}`)
}

// delete user
const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * from users WHERE id = $1'
  const values = [id]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    response.status(404).send(`not user found with id: ${id}`)
  } else {
    const statement = 'DELETE FROM users WHERE id = $1'
    const values = [id]

    await db.any(statement, values)

    response.status(200).send(`User deleted with ID: ${id}`)
  }
}

// get an user or user by name(first and last name)
const getUserByUserName = async (request, response) => {
  const name = request.params.name

  const statement = 'SELECT * FROM users WHERE name LIKE $1'
  const values = [`%${name}%`]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    response.status(404).send(`not user found with name: ${name}`)
  } else {
    response.status(200).json(results)
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUserName,
  updateUser,
  deleteUser
}
