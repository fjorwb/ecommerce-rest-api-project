// const db = require('./dbConfig')

const authorization = (permissions) => {
  return (req, res, next) => {
    if (permissions.includes((req.user.role).trim())) {
      next()
    } else {
      res.status(403).json({
        message: 'user not authorized'
      })
    }
  }
}

module.exports = authorization
