const { db } = require('../dbConfig')
const bcrypt = require('bcrypt')
const passport = require('passport')

const Convert = require('../helpers/tableCodes')

let user_num
let user_id
let hashedPassword

const logoutUser = function (req, res, next) {
  // console.log(req.session)
  // req.session.destroy(function () {
  //   res.clearCookie('connect.sid')
  //   res.redirect('/')
  // })
  req.logout((err) => {
    if (err) return next(err)
    req.flash('success_msg', 'You are logged out')
    res.render('index', { message: 'You have logged out successfully' })
  })
}

const registerPage = (req, res) => {
  res.render('register.ejs')
}

const loginPage = async (req, res) => {
  // console.log(req.session.flash.error)
  res.render('login.ejs')
}

const dashboard = (req, res) => {
  // console.log(req.isAuthenticated())
  res.render('dashboard.ejs', { user: req.user })
}

const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, password2 } = req.body

  const errors = []

  // console.log(firstname, lastname, email, password, password2)

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
    res.render('register.ejs', {
      errors,
      firstname,
      lastname,
      email,
      password,
      password2,
    })
  } else {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  try {
    // To get the last user_id in the table
    const users = await db.one('SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1')

    if (users?.length === 0 || users?.length === null) {
      user_num = 1
    } else {
      user_num = Number(users.user_id) + 1
    }
  } catch (error) {
    user_num = 1
  }

  user_id = Convert(user_num) // user_id for new user

  // check if email already exists
  const statement = 'SELECT * FROM users WHERE email = $1'
  const values = [email]

  const results = await db.any(statement, values)

  if (results.length > 0) {
    req.flash('error', 'Email already registered')
    res.render('register.ejs', { message: 'Email already registered' })
  } else {
    const name = `${firstname} ${lastname}`

    const statement = `INSERT INTO users (user_id, name, email, password, role)
              VALUES ($1, $2, $3, $4, $5)`
    const values = [user_id, name, email, hashedPassword, 'user']

    await db.any(statement, values)

    req.flash('success_msg', 'You are now registered. Please log in')
    res.send('user successfully registered')
    res.redirect('/auth/register')
  }
}

const loginUser = passport.authenticate('local', {
  successRedirect: '/auth',
  failureRedirect: '/auth/login',
  failureFlash: false,
})

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  loginPage,
  registerPage,
  dashboard,
}
