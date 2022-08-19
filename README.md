[![image]({[BadgeURLHere](https://img.shields.io/badge/Codecademy-FFF0E5?style=for-the-badge&logo=codecademy&logoColor=303347)})
](https://img.shields.io/badge/Codecademy-FFF0E5?style=for-the-badge&logo=codecademy&logoColor=303347)
# e-commerce RESTful API Project Plan
Table of Contents
- [General Info](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#general-info--summary)
- [Documentation](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#technologies)
- [Technologies](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#technologies)
- [Features](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#features)
- [Setup](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#setup)
- [Configuration](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#configuration--implementation)
- [Usage](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#usage)
- [Project Status](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#project-status)
- [Room for Improvement](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#room-for-improvement)
- [Acknowledgements](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#acknowledgements)
- [License](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#license)
- [Contact](https://github.com/fjorwb/ecommerce-rest-api-project/edit/master/README.md#contact)
## General Info / Summary
This project is part of the Full-Stack-Engineer path and the goal of is:
- Build a functioning e-commerce REST API using Express, - Node.js, and Postgres
- Allow users to register and log in via the API
- Allow CRUD operations on products
- Allow CRUD operations on user accounts
- Allow CRUD operations on user carts
- Allow a user to place an order
- Allow CRUD operations on orders
- Use Git version control
- Use command line
- Develop locally on your computer
- Document the API using Swagger
## Technologies
Project is created with:
##### Server
- express 4.18.1 
- express-async-errors 3.1.1 
- express-flash 0.0.2 
- express-rate-limit 6.4.0 
- express-session 1.17.3 
- passport 0.6.0 
- passport-local 1.0.0 
- bcrypt 5.0.1 
- body-parser 1.20.0 
- dotenv 16.0.1 
- cors 2.8.5 
- helmet 5.1.0 
- xss-clean 0.1.1
- memorystore 1.6.7 
- morgan 1.10.0 
- path 0.12.7 
- serve-favicon 2.5.0 
##### Database
- PostgreSQL v14.2
- pg 8.7.3 
- pg-promise 10.11.1 
##### Documentation
- swagger-jsdoc 6.2.1 
- swagger-ui-express 4.4.0 
## Features
#### Shopping
Shopping routes that allow shoppers to browse by category or search for products
Persistent carts that consolidate when user logs-in/registers so shopping data is not lost
#### User Accounts
Users can create an account to save shopping session and view information about their orders
#### Checkout Flow
Once a user finish shopping a checkout function summarizes, applies discounts add taxes to the cart and create an order and a account registry
#### Security
Custom hashing function for passwords using bcrypt
Custom RSA authentication middleware using secure passport and local strategy  to protect against CSRF
Custom data sanitizer and validation for protection against XSS attacks
#### API Documentation
Documentation with Swagger UI
Can try out endpoints with test data via Swagger UI, connected to a test database
Parameters, request body, and response options are documented for each endpoint
Can create an account and authorize to access all endpoints via Swagger UI
## Setup
To run locally, first install node_modules and generate RSA Key Pair:
```
npm install     
```

Open a PostgreSQL database of your choice. Schema with tables is located in db/init.sql. E.g., generate tables by running:
```
npm run create-db
```
#### Environment Variables
Create a .env file in root directory and add the following fields with respective values:
###### Postgres Database
- PGHOST=
- PGUSER=
- PGDATABASE=
- PGPASSWORD=
- PGPORT=
###### Express server
- PORT=
- SESSION_SECRET=
###### Node.js 
- NODE_ENV=
Then run the app:
node index.js
### Configuration / Implementation
A PostgreSQL database will comprise the data layer of the application. The database's schema will be designed using the  dbdiagram.io(https://dbdiagram.io/d)  tool and the database will be implemented through the  psql(https://www.postgresql.org/docs/current/app-psql.html)  CLI for PostgreSQL.
The application's server layer will be implemented on  
Node.js -> environment
Express.js -> server and routing functionality 
Passport.js -> authentication and authorization
pg-promises ->database integration
express-session -> session management
Finally,  GitHub is being used as the project's version control system.
### Database Schema
![resources/ERD%20ecomm-fjor.png](https://github.com/fjorwb/ecommerce-rest-api-project/blob/master/resources/ERD%20ecomm-fjor.png)
## Usage
This project can be used as a backend for an e-commerce website. The project handles various endpoints a user may need to access while online shopping such as:
- creating user accounts
users can save first and last name, email, and password to register and shopping
- displaying products and allowing query by parameter
- creating carts, and consolidating carts when a user logs in
- checkout flow and charging payments
- order summaries accessed through user account
- Authentication and Authorization with three roles: admin, manager, and user
## Project Status
IN PROGRESS: Working on additional security measures
## Room for Improvement
Room for improvement:
- Encryption of data in database
- Add more indexes to the database for faster queries
To do:
- Allow guest checkout flow
- Send confirmation email after POSTing order
- Build demo frontend site
- Incorporate Stripe payment gateway
## Acknowledgements
This project was based on Codecademy's full-stack portfolio project in the Full-Stack Engineer Career Path.
## License
## Contact
