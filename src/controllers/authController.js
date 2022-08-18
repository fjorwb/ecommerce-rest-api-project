/* eslint-disable camelcase */
const { db } = require('../dbConfig')
const bcrypt = require('bcrypt')
const passport = require('passport')

const Convert = require('../helpers/tableCodes')

let user_num
let user_id
let hashedPassword

const logoutUser = function (req, res) {
  req.session.destroy(function () {
    res.clearCookie('connect.sid')
    res.status(200).send('user logout successfully')
    // res.redirect('/')
  })
}

const registerPage = (req, res) => {
  res.status(200).send('user successfully registered')
  // res.render('register.ejs')
}

const loginPage = async (req, res) => {
  res.render('login.ejs')
}

const dashboard = (req, res) => {
  // res.render('dashboard.ejs')
  res.status(200).send('user successfully logged in')
}

const registerUser = async (request, response) => {
  const { firstname, lastname, email, password, password2 } = request.body

  const errors = []

  if (!firstname || !lastname || !email || !password || !password2) {
    errors.push({ message: 'Field missing. Please enter all fields required' })
  }
  if (password.length < 6) {
    errors.push({ message: 'Password must be a least 6 characters long' })
  }
  if (password !== password2) {
    errors.push({ message: 'Passwords do not match' })
  }
  if (errors.length > 0) {
    response.render('register.ejs', { errors, firstname, lastname, email, password, password2 })
  } else {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  try {
    const users = await db.one('SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1')

    if (users?.length === 0 || users?.length === null) {
      user_num = 1
    } else {
      user_num = Number(users.user_id) + 1
    }
  } catch (error) {
    user_num = 1
  }

  user_id = Convert(user_num)

  const statement = 'SELECT * FROM users WHERE email = $1'
  const values = [email]

  const results = await db.any(statement, values)

  if (results.length > 0) {
    request.flash('error', 'Email already registered')
    response.render('register.ejs', { message: 'Email already registered' })
  } else {
    const name = `${firstname} ${lastname}`

    const statement = `INSERT INTO users (user_id, name, email, password, role)
              VALUES ($1, $2, $3, $4, $5)`
    const values = [user_id, name, email, hashedPassword, 'user']

    await db.any(statement, values)

    request.flash('success_msg', 'You are now registered. Please log in')
    response.send('user successfully registered')
  }
}

const loginUser = passport.authenticate('local', {
  successRedirect: '/auth',
  failureRedirect: '/auth/login',
  failureFlash: false
}
)

module.exports = { registerUser, loginUser, logoutUser, loginPage, registerPage, dashboard }
