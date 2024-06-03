# deel hometask

this is my solution to the deel hometask

## api documentation

### run it up:

- `yarn` && `yarn start:dev`
  or
- `VSCODE` debug tab -> `Debug Dev`

### access it

go to http://localhost:3127/api#/ to loadup swagger-ui

## changes to the original requirements

### 1. added authN + authZ (simple) - auth controller

Intent: there are scoped requests, so we need to know who is making the request and if they are allowed to make it.
Roles: user (normal), admin (for the admin part of the requirement)

### 2. added a simple admin part

Intent: to be able to manage users, roles, and force-seed the db

- `force-seed`: seeds the db with the initial data set (clearing all the data first -> except users and profiles that are attached to admins)
- `register-admin`: creates a new admin user (to access the admin part of the api)
- `delete-user`: soft-deletes a user
- `best-profession`: normal hometask query -> _ this is scoped to admins only _
- `best-clients`: normal hometask query -> _ this is scoped to admins only _

### 3. changed data model for all tables to user guids instead of ids

Intent: this is more secure and allows for better data isolation + helps with id collision a lot

### 4. added a new table: `ledgers`

Intent: to be able to track all the transactions that are happening in the system and not rely on a single field in the `profile` table.
This new table is used for all transactions of the users, tracking negative and positive transactions for clients and contractors.
This also is used as an event source table for clients/contractors balance.

### 4. implementation details

This is implemented with `NestJs` as the underlying framework. This is also a mono-repo, with micro-services in mind (each app inside `apps` folder can be deployed independently).
All the `libs` can be shared between the `apps`.

- `apps/api` - the main api app

Implementation details:

- `authN` - makes use of `bcrypt` for password hashing and checking with 16 cycle rounds
- `authZ` - makes use of `jsonwebtoken` for token generation and validation
- `swagger` - openapi 3.0 documentation at http://localhost:3127/api#/
- `sequelize` - as the ORM for the database
- `SoA` - for regular user management / authN / authZ
- `CQRS` - for all the DB part of the task