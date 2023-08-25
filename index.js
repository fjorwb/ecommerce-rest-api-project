require('dotenv').config()
require('express-async-errors')

const express = require('express')

// extra security packages
const cors = require('cors') //
const helmet = require('helmet')
const xss = require('xss-clean')
// const rateLimiter = require('express-rate-limit')
// ------------------------------- END OF SECURITY -------------------------------

const passport = require('passport') //
const session = require('express-session') //
// const MemoryStore = require('memorystore')(session)
const flash = require('express-flash')
const bodyParser = require('body-parser') //
const morgan = require('morgan')
const path = require('path')
const favicon = require('serve-favicon')

// const notFound = require('./src/middlewares/notFound')
// const errorHandler = require('./src/middlewares/errorHandler')

const app = express() //

app.use(function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '//localhost:5000') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// ------------------------------- END OF IMPORTS -------------------------------

const initializePassport = require('./passportConfig')
initializePassport(passport)

const { checkAuthenticated } = require('./src/middlewares/authentication') // checkNotAuthenticated?
// const { checkNotAuthenticated } = require('./src/middlewares/authentication') // checkNotAuthenticated?

app.set('view engine', 'ejs')

// routers
const routerAuth = require('./src/routes/routeAuth')
const routerUsers = require('./src/routes/routeUsers')
const routerProducts = require('./src/routes/routeProducts')
const routerAccounts = require('./src/routes/routeAccounts')
const routerCategories = require('./src/routes/routeCategories')
const routerCart = require('./src/routes/routeCart')
const routerOrders = require('./src/routes/routeOrders')
const routerCheckout = require('./src/routes/routeCheckout')
const routerAddresses = require('./src/routes/routeAddresses')
const routerPaymentmethods = require('./src/routes/routePaymentmethods')
const routerDocs = require('./src/routes/routeDocs')

// ------------------------------- ROUTERS -------------------------------

// middlewares

app.use(express.static('/public'))
app.use('/css', express.static(path.join(__dirname, '/public/css')))
app.use('/image', express.static(path.join(__dirname, '/public/image')))
app.use(favicon(path.join(__dirname, '/public/image', 'favicon.ico')))

// app.set('trust proxy', 1)

// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 100
//   })
// )
app.use(morgan('tiny'))
app.use(bodyParser.json()) //
app.use(bodyParser.urlencoded({ extended: true })) //
app.use(helmet())
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)
app.use(xss())
app.use(flash())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // cookie: {
    //   secure: false,
    //   maxAge: 24 * 60 * 60 * 1000
    // },
    // store: new MemoryStore({
    //   checkPeriod: 86400000 // prune expired entries every 24h
    // }),
    resave: false,
    saveUninitialized: false,
    // secure: true,
    // httpOnly: true
  })
)
// ------------------------------- END OF MIDDLEWARES -------------------------------

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', routerAuth)
app.use('/users', checkAuthenticated, routerUsers)
app.use('/products', checkAuthenticated, routerProducts)
app.use('/accounts', checkAuthenticated, routerAccounts)
app.use('/categories', checkAuthenticated, routerCategories)
app.use('/cart', checkAuthenticated, routerCart)
app.use('/orders', checkAuthenticated, routerOrders)
app.use('/addresses', checkAuthenticated, routerAddresses)
app.use('/paymentmethods', checkAuthenticated, routerPaymentmethods)
app.use('/checkout', checkAuthenticated, routerCheckout)
app.use('/docs', routerDocs)

app.get('/', (req, res) => {
  // res.redirect('/docs')
  res.render('index.ejs')
})

// app.use(notFound)
// app.use(errorHandler)

// server
const port = process.env.PORT || 5000

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// })

const start = async () => {
  try {
    app.listen(port, console.log(`Listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
