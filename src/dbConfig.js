const Pool = require('pg').Pool
const pgp = require('pg-promise')()

let ssl = null

if (process.env.NODE_ENV === 'production') {
  ssl = {
    rejectUnauthorized: true
  }
}

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 20,
  ssl
})

const connection = ({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 20,
  ssl
})

const db = pgp(connection)

module.exports = { pool, db }
