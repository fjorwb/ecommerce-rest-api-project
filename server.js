require('dotenv').config()
require('express-async-errors')

const express = require('express')

const {db} = require('./src/dbConfig')
const {pool} = require('./src/dbConfig')

const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const methodOverride = require('method-override')
const morgan = require('morgan')
const notFound = require('./src/middlewares/notFound')
const errorHandler = require('./src/middlewares/errorHandler')

const app = express()

const port = process.env.PORT || 5000

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


//middlewares
app.use(express.static('/public'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/image', express.static(__dirname + '/public/image'))

app.use(morgan('tiny'))
app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.use('/auth', routerAuth)
app.use('/users', checkAuthenticated, routerUsers)
app.use('/products', routerProducts)
app.use('/accounts', checkAuthenticated, routerAccounts)
app.use('/categories', checkAuthenticated, routerCategories)
app.use('/cart', routerCart)
app.use('/orders', routerOrders)
app.use('/checkout', routerCheckout)

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('index.ejs')
})

// Check Authenticate
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.use(notFound)
app.use(errorHandler)


const start = async () => {
    try {
        app.listen(port, console.log(`Listening on port ${port}`))
        
    } catch (error) {
        console.log(error)
    }
}

start()
