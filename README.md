[![Build Status](https://travis-ci.org/andela-oaboluwarin/document-management-system.svg?branch=develop)](https://travis-ci.org/andela-oaboluwarin/document-management-system)
[![Test Coverage](https://codeclimate.com/github/andela-oaboluwarin/document-management-system/badges/coverage.svg)](https://codeclimate.com/github/andela-oaboluwarin/document-management-system/coverage)

# Document Management System
A full stack System that provides REST API enpoints for a document management system. It allows for creating, retrieving, updating and deleting actions to be carried out on roles, users and documents.
It also provides authorization and access levels to ensure that actions are well defined and managed.


## Technologies Used
- NodeJS
- React/Redux
- Express
- Sequelize ORM
- PostgreSQL


## Development
This application was developed using [NodeJs](https://nodejs.org) with express for routing. Postgres was used for persisting data with [Sequelize](https://sequelizejs.org) as [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping).

The frontend was built with the [react](https://facebook.github.io/react/) and [redux](reduxjs.org) framework.



## Installation
- Install [NodeJs](https://docs.npmjs.com/getting-started/installing-node) and [Postgres](http://www.postgresguide.com/setup/install.html) on your machine
- Clone the repository `$ git clone https://github.com/andela-oaboluwarin/document-management-system.git`
- CD into the directory you cloned into
- Install all required dependencies with `$ npm install`

## Testing (Server Side)
- Prepend the `db:migrate` & `db:seed` scripts in the package.json file with your database URL string (copy from your .env file) to have something like : `DB_URL=postgres://username:password@host:port/DB_NAME node_modules/.bin/sequelize db:migrate` else the migrations files will be imported into your default POSTGRES database.
- Run the DB migrate commmand with `npm run db:migrate`.
- Run Test `npm test`

## Usage
- Run DB migrate commmand with `npm run db:migrate`.
- Run DB seeder command with `npm run db:seed` to seed initial data into your DB.
- Start the app with `$ npm start -s`
- Login, Sign Up and start creating Documents once the app opens up on the browser

#### Key Application Features
A created user will have a role: admin, regular, rated/restricted, children.
- Regular, rated/restricted and children Users can:
    - Create an account
    - Login
    - Create a document
    - Limit access to a document by specifying an access group `i.e. public, private or role`.
    - View public documents created by other users.
    - View documents created by their access group with access level set as `role`.
    - Edit already created documents.
    - View `public` and `role` access level documents of other regular users.
    - Logout.

- In addition to the general user functions, an admin user can:
    - View all users.
    - View all created documents.
    - Delete any user.
    - Update any user's records.
    - Create a new role.
    - View all created roles.
    - Delete created roles aside the default roles `admin` and `regular`

**Documents**:
Documents can be created and must have:
- title
- content
- access; set by default to public but can be any of `private, public or role`

**Authentication**:
Users are authenticated and validated using JSON web token (JWT).
By generating a token on registration and login, API endpoints and documents are protected from unauthorised access.
Requests to protected routes are validated using the generated token.

## Endpoints
Here's the collection of routes. They can be checked out on Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/89b63da4a2a0c98485e7)

#### Users
EndPoint                      |   Functionality
------------------------------|------------------------
POST /user/signin         |   Logs in a user.
POST /user/logout        |   Logs out a user.
POST /user/              |   Creates a new user.
GET /user/               |   Gets all users (available to only the SuperAdmin and Admin).
GET /user/:id           |   Finds user by id.
PUT /user/:id           |   Updates a user's attributes based on the id specified (available to only the SuperAdmin and Admin)
DELETE /user/:id        |   Deletes user (available only to the SuperAdmin)
GET /user/:id/document   | Gets all documents for a particular user

#### Documents
EndPoint                      |   Functionality
------------------------------|------------------------
POST /document/          |   Creates a new document instance.
GET /document/           |   Gets all documents.
GET /document/:id       |   Find document by id.
PUT /document/:id       |   Updates a document attributes.
GET /document/user/:id            | Gets all documents for a user
DELETE /document/:id    |   Delete document.
GET /document/search/?q=${query} | Get all documents with title containing the search query

#### Roles
EndPoint                      |   Functionality
------------------------------|------------------------
GET /role/               |   Get all Roles.
POST /role/               |   Create a Role.
PUT /role/:id               |   Edit a Role.
DELETE /role/:id               |   Delete a Role.

It should be noted that the endpoints for roles here are only available to the Admin.


## Limitations
- Pagination is not integrated yet, and so as the documents grow in numbers, locating them becomes a difficult process
- A non-admin user cannot request to be upgraded to an admin
