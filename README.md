
# E-commerce RESTful API Project Plan
Table of Contents
- General Info
- Documentation
- Technologies
- Setup
- Features
- Usage
- Acknowledgements
- License
- Contact

## General Info / Summary

The goal of this project is to develop a RESTful API for a fictional e-commerce web application using Node.js, Express and PostgreSQL.

The API will provide basic functionality expected from an e-commerce app:

## Technologies
Project is created with:

##### Server

- node.js v16.14.2
- express v4.17.3
- npm v8.5.0
- passport.js v0.0.1
- express-session v1.15.6
- corse v2.5.3
- helmet v3.0.3

##### Database
- PostgreSQL v14.2
- psql v12.1
- pg-promise v8.4.0

##### Documentation
- swagger-jsdocs v3.0.0
- swagger-ui v3.35.0

## Setup

To run locally, first install node_modules and generate RSA Key Pair:

npm install

Will also run install script of package.json, which will generate an RSA key pair in a .env file.

Open a PostgreSQL database of your choice. Schema with tables is located in db/init.sql. E.g., generate tables by running:

cd db
cat init.sql | psql -h [PGHOST] -U [PGUSER] -d [PGDATABASE] -w [PGPASSWORD]
Where 'PGHOST', 'PGUSER', 'PGDATABASE', and 'PGPASSWORD' are your respective Postgres host, user, database, and password values.

Add the following fields with respective values to the .env file:

#### Environment Variables
##### Postgres Database
PGHOST=
PGUSER=
PGDATABASE=
PGPASSWORD=
PGPORT=

##### Express server
PORT=
SESSION_SECRET=

##### Node.js 
NODE_ENV=


Then run the app:

node index.js

#### Installation

Usage
This project can be used as a backend for an e-commerce website. The project handles various endpoints a user may need to access while online shopping such as:

creating user accounts
users can save addresses and payment methods to account
displaying products and allowing query by parameter
creating carts, and consolidating carts when a user logs in
checkout flow and charging payments with Stripe
order summaries accessed through user account
Note: Must use HTTPS with JWT Bearer Authentication See Swagger API Documentation for info routes and their variable requirements.


## Features

#### Shopping
Shopping routes that allow shoppers to browse by category or search for products
Persistent carts that consolidate when user logs-in/registers so shopping data is not lost
#### User Accounts
Users can create an account to save shopping session and view information about their orders
Allow users to store addresses and payment methods, and set a primary address and primary payment method
#### Fully-Built Checkout Flow
User can use saved payment methods and addresses, or enter new ones at checkout
Checkout route provides a review page before placing order
Payment processing with Stripe API
#### Security
Custom hashing function for passwords using bcrypt and a salt
Custom RSA authentication middleware using secure JWT Bearer Tokens to protect against CSRF
Custom data sanitizer and validation for protection against XSS attacks
Parameterized queries to protect against SQL injection
#### Testing
Thorough test suite with multiple tests for each route
End-to-end tests for the checkout flow
pre-test and post-test scripts to automate testing setup and tear down
#### API Documentation
Documentation with Swagger UI
Can try out endpoints with test data via Swagger UI, connected to a test database
Parameters, request body, and response options are documented for each endpoint
Can create an account and authorize to access all endpoints via Swagger UI


## Configuration / Implementation

A PostgreSQL database will comprise the data layer of the application. The database's schema will be designed using the  dbdiagram.io(https://dbdiagram.io/d)  tool and the database will be implemented through the  psql(https://www.postgresql.org/docs/current/app-psql.html)  CLI for PostgreSQL.

The application's server layer will be implemented on  
Node.js -> envvironment
Express.js -> server and routing functionallity 
Passport.js -> authentication and authorization
pg-promises ->database integration
express-session -> session management

Finally,  GitHub is being used as the project's version control system.

## Database Schema

!(resources/ERD%20ecomm-fjor.png)

Diagram on dbdiagram.io(https://dbdiagram.io/d/62fec877c2d9cf52fad5fb29)

## OpenAPI Specification

### Project Status
IN PROGRESS: Working on additional secutiry measures

### Room for Improvement
Room for improvement:

Encryption of data in database
Add more indexes to the database for faster queries
To do:

Allow guest checkout flow
Send confirmation email after POSTing order
Build demo frontend site

## Acknowledgements
This project was based on Codecademy's full-stack portfolio project in the Full-Stack Engineer Career Path.

## License

## Contact