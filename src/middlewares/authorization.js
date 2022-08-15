// const db = require('./dbConfig')

const authorization = (permissions) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      next()
    } else {
      if (permissions.includes(req.user.role)) {
        next()
      } else {
        res.status(403).json({
          message: 'Forbidden'
        })
      }
    }
  }
}

module.exports = authorization
