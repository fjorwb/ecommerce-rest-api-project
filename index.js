require('dotenv').config()
// require('express-async-errors')

// extra security packages
const helmet = require('helmet')
// const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const corsMiddleware = require('./src/middlewares/corsMiddleware')

const express = require('express')

const { checkAuthenticated } = require('./src/middlewares/authentication') // checkNotAuthenticated?

const passport = require('passport')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const flash = require('express-flash')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const favicon = require('serve-favicon')

const notFound = require('./src/middlewares/notFound')
const errorHandler = require('./src/middlewares/errorHandler')

// Swagger
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ecommerce API',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: [`${path.join(__dirname, './src/routes/*.js')}`]
}

const app = express()

const initializePassport = require('./passportConfig')
initializePassport(passport)

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

// middlewares
app.use(express.static('/public'))
app.use('/css', express.static(path.join(__dirname, '/public/css')))
app.use('/image', express.static(path.join(__dirname, '/public/image')))
app.use(favicon(path.join(__dirname, '/public/image', 'favicon.ico')))

app.set('trust proxy', 1)

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(morgan('tiny'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(helmet())
app.use('*', corsMiddleware)
app.use(corsMiddleware)
app.use(xss())

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  saveUninitialized: false,
  secure: true,
  httpOnly: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', routerAuth)
app.use('/users', checkAuthenticated, routerUsers)
app.use('/products', checkAuthenticated, routerProducts)
app.use('/accounts', checkAuthenticated, routerAccounts)
app.use('/categories', checkAuthenticated, routerCategories)
app.use('/cart', checkAuthenticated, routerCart)
app.use('/orders', checkAuthenticated, routerOrders)
app.use('/checkout', checkAuthenticated, routerCheckout)

app.use('/docs', swaggerUI.serve, (swaggerUI.setup(swaggerJsDoc(swaggerSpec))))

app.get('/', (req, res) => {
  res.status(200)
  res.json({ msg: 'mensaje' })
  res.send('helo!!!!!!!!!!!!!')
  res.render('index.ejs')
})

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    app.listen(port, console.log(`Listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
