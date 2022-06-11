const LocalStrategy = require('passport-local').Strategy
const { pool } = require('./src/dbConfig')
const bcrypt = require('bcrypt')

function initialize (passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
      (error, results) => {
        if (error) {
          throw error
        }

        if (results.rows.length > 0) {
          const user = results.rows[0]

          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
              throw error
            }
            if (isMatch) {
              return done(null, user)
            } else {
              // password is incorrect
              return done(null, false, { message: 'Password is incorrect' })
            }
          })
        } else {
          // No user
          return done(null, false, {
            message: 'No user with that email. please register'
          })
        }
      }
    )
  }

  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      authenticateUser)
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        return done(error)
      }
      return done(null, results.rows[0])
    })
  })
}

module.exports = initialize
