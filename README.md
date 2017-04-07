[![Build Status](https://travis-ci.org/andela-oaboluwarin/document-management-system.svg?branch=develop)](https://travis-ci.org/andela-oaboluwarin/document-management-system)
[![Test Coverage](https://codeclimate.com/github/andela-oaboluwarin/document-management-system/badges/coverage.svg)](https://codeclimate.com/github/andela-oaboluwarin/document-management-system/coverage)

# Document Management System
A full stack System that provides REST API enpoints for a document management system. It allows for creating, retrieving, updating and deleting actions to be carried out on roles, users and documents.
It also provides authorization and access levels to ensure that actions are well defined and managed.


## Development
This application was developed using [NodeJs](https://nodejs.org) with express for routing. Postgres was used for persisting data with [Sequelize](https://sequelizejs.org) as [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping).

The frontend was built with the [react](https://facebook.github.io/react/) and [redux](reduxjs.org) framework.


## Installation
- Install [NodeJs](https://docs.npmjs.com/getting-started/installing-node) and [Postgres](http://www.postgresguide.com/setup/install.html) on your machine
- Clone the repository `$ git clone https://github.com/andela-oaboluwarin/document-management-system.git`
- CD into the directory you cloned into
- Install all required dependencies with `$ npm install`
- Create a `.env` file in your root directory that will house your environment variables

## Testing Server Side
- Prepend the `db:migrate` & `db:seed` scripts in the package.json file with your database URL string (copy from your .env file) to have something like : `DB_URL=postgres://username:password@host:port/DB_NAME node_modules/.bin/sequelize db:migrate` else the migrations files will be imported into your default POSTGRES database.
- Run the DB migrate commmand with `npm run db:migrate`.
- Run Test `npm test`

## Usage
- Run DB migrate commmand with `npm run db:migrate`.
- Run DB seeder command with `npm run db:seed` to seed initial data into your DB.
- Start the app with `$ npm start -s`
- Login, Sign Up and start creating Documents once the app opens up on the browser

**Users**:
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

**Documents**:
Documents can be created and must have:
- title
- content
- access; set by default to public but can be any of `private, public or role`

**Roles**:
Roles can also be created (by an admin), the default roles are `admin` and `regular`

**Authentication**:
Users are authenticated and validated using JSON web token (JWT).
By generating a token on registration and login, API endpoints and documents are protected from unauthorised access.
Requests to protected routes are validated using the generated token.

## Endpoints
The following endpoints are available and can be verified with [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/47242a54bdfc7d55498f)

**Users**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/api/user](#create-users) | Create a new user
GET | [/api/user](#get-users) | Get all users
GET | [/api/user/:id](#get-a-user) | Get details of a specific user
PUT | [/api/user/:id](#update-user) | Edit user details
DELETE | [/api/user/:id](#delete-user) | Remove a user from storage
GET | [/api/user/login](#login) | To log a user in
GET | [/api/user/logout](#logout) | To log a user out

**Roles**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/api/role](#create-role) | Create a new role
GET | [/api/role](#get-roles) | Get all created roles
GET | [/api/role/:id](#get-a-role) | Get a specific role
PUT | [/api/role/:id](#edit-a-role) | Edit a specific role
DELETE | [/api/role/:id](#delete-a-role) | Delete a specific role

**Documents**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/api/document](#create-document) | Create a new document
GET | [/api/document](#get-documents) | Retrieve all documents
GET | [/api/document/?id=id](#get-a-document) | Retrieve a specific document
GET | [/api/user/:id/document](#get-documents-by-user) | Retrieve all documents created by a user
GET | [/api/document?order=desc&limit=10](#get-documents) | Retrieve maximum of first 10 documents ordered by date of creation
PUT | [/api/document/:id](#update-document) | Update a specific document
DELETE | [/api/document/?id=id](#delete-document) | Remove a specific document from storage


## Limitations
- The current browser-rendered version does not have the search functionality enabled
- Pagination is not integrated yet, and so as the documents grow in numbers, locating them becomes a difficult process
- A non-admin user cannot request to be upgraded to an admin
