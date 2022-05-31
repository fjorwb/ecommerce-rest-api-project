const {pool} = require('../dbConfig')
const {db} = require('../dbConfig')
const bcrypt = require('bcrypt')
const passport = require('passport')

const Convert = require('../helpers/tableCodes')

const logoutUser = function (req, res){
req.session.destroy(function() {
    res.clearCookie('connect.sid')
    res.redirect('/')
  })
}

const registerPage = (req, res) => {
  res.render('register.ejs')
}

const loginPage = async (req, res) => {
  res.render('login.ejs')
}

const dashboard = (req, res) => {
  res.render('dashboard.ejs')
}

const registerUser = async (request, response) => {
  let {firstname, lastname, email, password, password2} = request.body

  let errors = []

  if(!firstname || !lastname || !email || !password || !password2) {
    errors.push({message: 'Field missing. Please enter all fields required'})
  }
  if(password.length < 6) {
    errors.push({message: "Password must be a least 6 characters long"})
  }
  if(password !== password2) {
    errors.push({message: "Passwords do not match"})
  }
  if(errors.length > 0) {
    response.render("register.ejs", {errors, firstname, lastname, email, password, password2})
  } else {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  //check orders for orders_id
  try {
    const users = await db.one('SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1')

    if(users?.length === 0 || users?.length === null){
        user_num = 1
    } else {
        user_num = Number(users.user_id) + 1
    }

  } catch (error) {
      user_num = 1
  }

  user_id = Convert(user_num)

  pool.query(
    'SELECT * FROM users WHERE email = $1', [email],(err, results) => {
      if (err) {
        console.log(err);
      }

      if(results.rows.length > 0) {
        console.log('Email already registered')
        request.flash("error", "Email already registered")
        response.render("register.ejs", {message: 'Email already registered'})
      } else {
        const name = `${firstname} ${lastname}`
        pool.query(
          `INSERT INTO users (user_id, name, email, password)
              VALUES ($1, $2, $3, $4)`,
          [user_id, name, email, hashedPassword],
          (error, results) => {
            if(error) {
              throw error
            }
            request.flash("success_msg", "You are now registered. Please log in");
            response.redirect("/auth/login");
          }
        )
      }
    }
  )
}

const loginUser = passport.authenticate("local", {
    successRedirect: "/auth",
    failureRedirect: "/auth/login",
    failureFlash: true
  }
)

module.exports = {registerUser, loginUser, logoutUser, loginPage, registerPage, dashboard}