const {pool} = require('../dbConfig')

const getAccounts = (request, response) => {
  pool.query('SELECT id, account_id, user_id FROM accounts ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAccountById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM accounts WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createAccount = async (request, response) => {
  const { 
      account_id,
      user_id,
    } = request.body

  await pool.query('INSERT INTO accounts (account_id, user_id) VALUES ($1, $2) RETURNING *', [account_id, user_id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Account successfully added with ID: ${results.rows[0].id}`)
  })
}

const updateAccount = (request, response) => {
  const id = parseInt(request.params.id)
  const { 
      account_id,
      user_id,
    } = request.body

  pool.query(
    'UPDATE accounts SET account_id = $1, user_id = $2 WHERE id = $3', 
    [
      account_id, 
      user_id,
      id
    ],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Account modified with ID: ${id}`)
    }
  )
}

const deleteAccount = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM Accounts WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Account deleted with ID: ${id}`)
  })
}

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
}