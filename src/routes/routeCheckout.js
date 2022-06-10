
const express = require('express')
const routerCheckout = express.Router()

const { Checkout } = require('../controllers/checkoutController')

routerCheckout.route('/').get(Checkout)

module.exports = routerCheckout
