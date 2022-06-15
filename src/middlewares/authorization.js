const { db } = require('../dbConfig')

const ConvertObject = require('../helpers/ConvertObject')
// const ShowUser = require('../helpers/ShowUser')

const authorization = (permissions) => {
  return async (req, res, next) => {
    const user = req.user.id
    console.log(user)
    if (!user) {
      res.status(400)
    }

    console.log('user:', user)

    const statement = 'SELECT role FROM users WHERE id = $1'
    const values = [user]

    const result = await db.any(statement, values)
    console.log(result)

    const role = (Object.values(result)[0].role).trim() // this is a string
    console.log(role)

    const perm = Object.values(permissions) // this is an object
    console.log(perm)

    const permission = ConvertObject(perm)

    console.log(permission)
    console.log(typeof (permission))

    if (perm.includes(role)) {
      next()
    } else {
      res.status(401).json('not allowed')
    }
  }
}

module.exports = authorization
