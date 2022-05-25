const {pool} = require('../dbConfig')
const bcrypt = require('bcrypt')
const passport = require('passport')

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
  let {name, email, password, password2} = request.body

  let errors = []

  console.log(name, email, password, password)

  if(!name || !email || !password || !password2) {
    errors.push({message: 'Field missing. Please enter all fields required'})
  }
  if(password.length < 6) {
    errors.push({message: "Password must be a least 6 characters long"})
  }
  if(password !== password2) {
    errors.push({message: "Passwords do not match"})
  }
  if(errors.length > 0) {
    response.render("register.ejs", {errors, name, email, password, password2})
  } else {
    hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
  }
  pool.query(
    'SELECT * FROM users WHERE email = $1', [email],(err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results.rows);

      if(results.rows.length > 0) {
        console.log('Email already registered')
        request.flash("error", "Email already registered")
        response.render("register.ejs", {message: 'Email already registered'})
      } else {
        pool.query(
          `INSERT INTO users (name, email, password)
              VALUES ($1, $2, $3)`,
          [name, email, hashedPassword],
          (error, results) => {
            if(error) {
              throw error
            }
            console.log(results.rows)
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