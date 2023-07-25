// Check Authenticate
function checkAuthenticated(req, res, next) {
  console.log('REQ REQ -------------------------------------', req)
  console.log('RES RES -------------------------------------', res)
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/auth/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = { checkAuthenticated, checkNotAuthenticated }
