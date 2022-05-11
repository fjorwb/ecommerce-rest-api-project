const express = require('express')
const bodyParser = require('body-parser')

const app = express()


app.use(express.json());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}))

const routerUsers = require('./src/routes/routeUsers')

app.use('/users', routerUsers)

app.get('', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })
})

const port = 5000

app.listen(port, console.log(`Listening on port ${port}`))
