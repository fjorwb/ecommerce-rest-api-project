// const db = require('./dbConfig')

const authorization = (permissions) => {
  console.log('permissions:---' + permissions)
  return (req, res, next) => {
    console.log(req.user.role)
    permissions.includes(req.user.role) ? console.log('ok') : console.log('no ok')
    if (permissions.includes(req.user.role)) {
      next()
    } else {
      res.status(403).json({
        message: 'Forbidden'
      })
    }
  }
}

module.exports = authorization
