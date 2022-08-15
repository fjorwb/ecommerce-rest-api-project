const { db } = require('../dbConfig')

// const ConvertObject = require('../helpers/ConvertObject')
// const ShowUser = require('../helpers/ShowUser')

const authorization = (permissions) => {
  return async (req, res, next) => {
    const user = req.user.id
    if (!user) {
      res.status(400)
    }

    const statement = 'SELECT role FROM users WHERE id = $1'
    const values = [user]

    const result = await db.any(statement, values)
    console.log(result)

    const role = (Object.values(result)[0].role)
    console.log(role)

    const permission = Object.values(permissions)
    console.log(permission)

    if (permission.includes(role)) {
      console.log('allowed')
      next()
    } else {
      res.status(401).json('not allowed')
    }
  }
}

module.exports = authorization
