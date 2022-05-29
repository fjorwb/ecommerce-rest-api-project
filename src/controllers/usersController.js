const {pool} = require('../dbConfig')

// get all users
const getAllUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// get an user by id
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// update user
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  if(!name || !email) {
  return response.status(400).send('request.body is missing/incomplete. Check request.body')
  }

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

// delete user
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

// get an user or user by name(first and last name)
const getUserByUserName = (request, response) => {
  console.log(request.params.name)

  // const {name} = JSON.parse(request.params.name)
  const name = request.params.name

  pool.query('SELECT * FROM users WHERE name = $1', [name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUserName,
  updateUser,
  deleteUser,
}