require('dotenv').config()

const { DB } = require('../../config')

const { Client } = require('pg')

const database = async () => {
  const createDatabase = 'CREATE DATABASE ecomm_nep'

  const usersTableStatement = `
    CREATE TABLE users(
      id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      user_id                 VARCHAR(6)      NOT NULL,
      name                    VARCHAR(50)     NOT NULL,
      email                   VARCHAR(50)     NOT NULL,
      password                VARCHAR(100)    NOT NULL,
      role                    VARCHAR(10)    NOT NULL
    )
  `

  const categoriesTableStatement = `
    CREATE TABLE categories(
      id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      category_id             VARCHAR(4)      NOT NULL,
      category_name           VARCHAR(20)     NOT NULL,
      category_description    VARCHAR(50)     NOT NULL
    )
  `

  const productsTableStatement = `
    CREATE TABLE products (
      id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      product_id              VARCHAR(9)      NOT NULL,
      name                    VARCHAR(20)     NOT NULL,
      description             VARCHAR(50)     NOT NULL,
      category_id             VARCHAR(4)      NOT NULL,
      unit                    VARCHAR(10)     NOT NULL,
      price                   INT             NOT NULL,
      discount                INT             NOT NULL,
      img                     VARCHAR(100)    NOT NULL
    )
  `

  const cartTableStatement = `
    CREATE TABLE cart (
      id                      BIGINT          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      cart_id                 VARCHAR(6)      NOT NULL,
      user_id                 VARCHAR(6)      NOT NULL,
      product_id              VARCHAR(9)      NOT NULL,
      quantity                INT             NOT NULL,
      price                   INT             NOT NULL,
      discount                INT             NOT NULL,
      date                    BIGINT          NOT NULL
    )
  `

  const ordersTableStatement = `
    CREATE TABLE orders (
      id                      BIGINT          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      order_id                VARCHAR(6)      NOT NULL,
      cart_id                 VARCHAR(6)      NOT NULL,
      user_id                 VARCHAR(6)      NOT NULL,
      account_id              VARCHAR(6)      NOT NULL,
      product_id              VARCHAR(9)      NOT NULL,
      quantity                INT             NOT NULL,
      price                   INT             NOT NULL,
      discount                INT             NOT NULL,
      tax                     INT             NOT NULL,
      date                    BIGINT          NOT NULL
    )
  `

  const accountsTableStatement = `
    CREATE TABLE accounts (
      id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      account_id              VARCHAR(10)     NOT NULL,
      user_id                 VARCHAR(6)      NOT NULL,
      order_id                VARCHAR(6)      NOT NULL,
      amount                  INT             NOT NULL,
      tax                     INT             NOT NULL,
      accotype                VARCHAR(2)      NOT NULL,
      date                    BIGINT          NOT NULL 
    )
  `

  const sessionTableStatement = `
    CREATE TABLE session (
      sid                    VARCHAR          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      sess                   JSON             NOT NULL,
      expire                 TIMESTAMP WITHOUT TIME ZONE NOT NULL
    )
  `

  // Connect to heroku
  try {
    const db = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PORT
    })

    await db.connect()

    // Create tables on database
    await db.query(createDatabase)
    await db.query(usersTableStatement)
    await db.query(categoriesTableStatement)
    await db.query(productsTableStatement)
    await db.query(cartTableStatement)
    await db.query(ordersTableStatement)
    await db.query(accountsTableStatement)
    await db.query(sessionTableStatement)

    await db.end()
  } catch (error) {
    console.log('Error creating one or more tables: ', error)
  }
}

database()
