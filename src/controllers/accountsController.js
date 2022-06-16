/* eslint-disable camelcase */
const { db } = require('../dbConfig')

const AccountNumber = require('../helpers/accountCode')

const date = Date.now()

const getAccounts = async (request, response) => {
  const statement = 'SELECT id, account_id, user_id FROM accounts ORDER BY id ASC'

  const results = await db.any(statement)

  if (results?.length === 0) {
    response.status(404).send('not account found')
  } else {
    response.status(200).json(results)
  }
}

const getAccountById = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM accounts WHERE id = $1'
  const values = [id]

  const results = await db.any(statement, values)

  if (results?.length === 0) {
    response.status(404).send(`not account found with id: ${id}`)
  } else {
    response.status(200).json(results)
  }
}

const createAccount = async (request, response) => {
  const {
    user_id,
    accotype,
    amount
  } = request.body

  const tax = 0

  const statement = 'SELECT * FROM accounts WHERE user_id = $1'
  const values = [user_id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send('not account created. create user first')
  } else {
    const type = AccountNumber(accotype)
    const account_id = user_id + '-' + type

    const statement = `INSERT INTO accounts (account_id, user_id, accotype, amount, tax, date)
                       VALUES($1, $2, $3, $4, $5, $6)`
    const values = [account_id, user_id, accotype, amount * (1 + tax), tax, date]

    await db.any(statement, values)

    response.status(201).send(`account created with id: ${account_id}`)
  }
}

const updateAccount = async (request, response) => {
  const id = parseInt(request.params.id)
  const { amount } = request.body

  const statement = 'SELECT * FROM accounts WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)
  console.log(temp)

  if (temp?.length === 0) {
    response.status(404).send(`not account found with id:${id}`)
  } else {
    const statement = 'UPDATE accounts SET amount = $1 WHERE id = $2'
    const values = [amount, id]

    await db.any(statement, values)

    response.status(200).send(`Account updated with ID: ${id}`)
  }
}

const deleteAccount = async (request, response) => {
  const id = parseInt(request.params.id)

  const statement = 'SELECT * FROM accounts WHERE id = $1'
  const values = [id]

  const temp = await db.any(statement, values)

  if (temp?.length === 0) {
    response.status(404).send(`not account found with id: ${id}`)
  } else {
    const statement = 'DELETE FROM Accounts WHERE id = $1'
    const values = [id]

    await db.any(statement, values)

    response.status(200).send(`Account deleted with ID: ${id}`)
  }
}

module.exports = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
}
