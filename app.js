require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

app.use(express.static('/public'))
app.use('/css', express.static(__dirname + '/public/css'))

app.set('view engine', 'ejs')

const morgan = require('morgan')
const bodyParser = require('body-parser')
const notFound = require('./src/middlewares/notFound')
const errorHandler = require('./src/middlewares/errorHandler')


app.use(morgan('tiny'))
app.use(express.json());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}))

app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
    // throw new Error
    // res.json({ info: 'Node.js, Express, and Postgres API' })
})

const routerUsers = require('./src/routes/routeUsers')
const routerProducts = require('./src/routes/routeProducts')
const routerAccounts = require('./src/routes/routeAccounts')
const routerCategories = require('./src/routes/routeCategories')
const routerCart = require('./src/routes/routeCart')
const routerOrders = require('./src/routes/routeOrders')


app.use('/users', routerUsers)
app.use('/products', routerProducts)
app.use('/accounts', routerAccounts)
app.use('/categories', routerCategories)
app.use('/cart', routerCart)
app.use('/orders', routerOrders)


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
