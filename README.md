[![Build Status](https://travis-ci.org/oreoluwade/document-management-system.svg?branch=develop)](https://travis-ci.org/oreoluwade/document-management-system)
[![Coverage Status](https://coveralls.io/repos/github/oreoluwade/document-management-system/badge.svg?branch=develop)](https://coveralls.io/github/oreoluwade/document-management-system?branch=develop)

# Document Management System
A REST API backend for a Document Collection Application.


## Technologies Used
- NodeJS
- Express
- Sequelize ORM
- PostgreSQL


## Development
This application was developed using [NodeJs](https://nodejs.org) with express for routing. Postgres was used for persisting data with [Sequelize](https://sequelizejs.org) as [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping).


## Installation
- Install [NodeJs](https://docs.npmjs.com/getting-started/installing-node) and [Postgres](http://www.postgresguide.com/setup/install.html) on your machine
- Clone the repository `$ git clone https://github.com/andela-oaboluwarin/document-management-system.git`
- CD into the directory you cloned into
- Install all required dependencies with `$ npm install`

## Testing
- Prepend the `db:migrate` & `db:seed` scripts in the package.json file with your database URL string (copy from your .env file) to have something like : `DB_URL=postgres://username:password@host:port/DB_NAME node_modules/.bin/sequelize db:migrate` else the migrations files will be imported into your default POSTGRES database.
- Run the DB migrate commmand with `npm run db:migrate`.
- Run Test `npm test`
