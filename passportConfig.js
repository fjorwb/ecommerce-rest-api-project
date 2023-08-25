const LocalStrategy = require('passport-local').Strategy

const { pool, db } = require('./src/dbConfig')

const bcrypt = require('bcrypt')

function initialize(passport) {
  // console.log('initialized...')

  const authenticateUser = async (email, password, done) => {
    // console.log('email & password', email, password)

    const statement = 'SELECT * FROM users WHERE email = $1'
    const values = [email]

    const results = await db.query(statement, values)
    // console.log('RESULTS', results)

    if (results.length === 0) {
      return done(null, false, { message: 'Incorrect email.' })
    } else {
      if (results.length > 0) {
        const user = results[0]
        // console.log('USER', user)

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
          message: 'No user with that email. please register',
        })
      }
    }
  }

  passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser)
  )

  // passport.serializeUser((user, done) => {
  //   done(null, user.id)
  // })
  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        return done(error) // 1
        // throw error  // 2
      }
      // console.log(`ID is: ${results.rows[0].id}`)
      return done(null, results.rows[0]) // 1
    })
  })
  // passport.deserializeUser((id, cb) => {
  //   pool.query('SELECT * FROM users WHERE id = $1', [id], (error, user) => {
  //     const userInformation = {
  //       username: user.username
  //     }
  //     cb(error, userInformation)
  //   })
  // })
}

module.exports = initialize
