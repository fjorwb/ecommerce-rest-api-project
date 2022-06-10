const notFoundMiddleware = (req, res) => {
  res.status(400).json('Route does not exist!')
}

module.exports = notFoundMiddleware
