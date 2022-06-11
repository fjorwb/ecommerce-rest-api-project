const errorHandler = async (error, req, res, next) => {
  if (error) {
    throw error
  }
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandler
