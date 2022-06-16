require('dotenv').config()
const { DB } = require('../../config')

const { Client } = require('pg')

const database = async () => {
  const createDatabase = 'CREATE DATABASE IF NOT EXISTS ecomm_nep'

  const usersTableStatement = `
        CREATE TABLE IF NOT EXISTS users(
            id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            user_id                 VARCHAR(6)      NOT NULL,
            name                    VARCHAR(50)     NOT NULL,
            email                   VARCHAR(50)     NOT NULL,
            password                VARCHAR(100)    NOT NULL,
            role                    VARCHAR(10)    NOT NULL
        )
    `

  const categoriesTableStatement = `
        CREATE TABLE IF NOT EXISTS categories(
            id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            category_id             VARCHAR(4)      NOT NULL,
            category_name           VARCHAR(20)     NOT NULL,
            category_description    VARCHAR(50)     NOT NULL
        )
    `

  const productsTableStatement = `
        CREATE TABLE IF NOT EXISTS products (
            id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            product_id              VARCHAR(9)      NOT NULL,
            name                    VARCHAR(20)     NOT NULL,
            description             VARCHAR(50)     NOT NULL,
            unit                    VARCHAR(10)     NOT NULL,
            price                   NUMERIC(10,2)   NOT NULL,
            discount                NUMERIC(6,3)    NOT NULL,
            img                     VARCHAR(100)    NOT NULL
        )
    `

  const cartTableStatement = `
        CREATE TABLE IF NOT EXISTS cart (
            id                      BIGINT          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            cart_id                 VARCHAR(6)      NOT NULL,
            user_id                 VARCHAR(6)      NOT NULL,
            product_id              VARCHAR(9)      NOT NULL,
            quantity                INT             NOT NULL,
            date                    BIGINT          NOT NULL
        )
    `

  const ordersTableStatement = `
        CREATE TABLE IF NOT EXISTS orders (
            id                      BIGINT          PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            order_id                VARCHAR(6)      NOT NULL,
            cart_id                 VARCHAR(6)      NOT NULL,
            user_id                 VARCHAR(6)      NOT NULL,
            account_id              VARCHAR(6)      NOT NULL,
            product_id              VARCHAR(9)      NOT NULL,
            quantity                INT             NOT NULL,
            price                   NUMERIC(10,2)   NOT NULL,
            discount                NUMERIC(6,3)    NOT NULL,
            tax                     NUMERIC(6,3)    NOT NULL,
            date                    BIGINT          NOT NULL
        )
    `

  const accountsTableStatement = `
        CREATE TABLE IF NOT EXISTS accounts (
            id                      INT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
            account_id              VARCHAR(10)     NOT NULL,
            user_id                 VARCHAR(6)      NOT NULL,
            order_id                VARCHAR(6)      NOT NULL,
            amount                  NUMERIC(10,2)   NOT NULL
        )
    `

  try {
    const bd = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PORT
    })

    await bd.connect()

    // Create tables on database
    await bd.query(createDatabase)
    await bd.query(usersTableStatement)
    await bd.query(categoriesTableStatement)
    await bd.query(productsTableStatement)
    await bd.query(cartTableStatement)
    await bd.query(ordersTableStatement)
    await bd.query(accountsTableStatement)

    await bd.end()
  } catch (error) {
    console.log('Error creating one or more tables: ', error)
  }
}

database()
