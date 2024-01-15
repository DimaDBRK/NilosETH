# Nilos 
 <!-- ![Logo](/docs/images/niloslogo.png) -->
<p align="center">
  <a href="https://www.nilos.io/" target="_blank"><img src="/docs/images/niloslogo.png" alt="Nilos IO" /></a>
</p>
  
# Task Description: 

## Web Service Overview

The application allows viewing and editing the restaurant menu through a web interface.


- Backend: Nest.js + SQLite + ethers.js
- Blockchain: Ganache - personal Ethereum blockchain
- Tests: e2e
- Frontend: React + Axios
- Authentication System: (mock) for demo only

Demo video: TBC

## Table of Contents
- [Nilos](#nilos)
- [Task Description:](#task-description)
  - [Web Service Overview](#web-service-overview)
  - [Table of Contents](#table-of-contents)
  - [Database](#database)
  - [Backend and API](#backend-and-api)
  - [Ganache](#ganache)
  - [Tests](#tests)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Test](#test)

## Database

Database type is SQLite.
It is serverless database engine.
The <a href="/backend/ormconfig.json" target="_blank">ormconfig.json</a> file indicates that your NestJS application is configured to use a SQLite database.
"db" - the name of the SQLite database file. This file will be located in the root of project directory.

Installation: If you don't have SQLite installed on your system, you'll need to install it. Often just need the SQLite library which is usually included in most operating systems by default.

There are Tables:

## Backend and API

NestJS used. It is a popular framework for building efficient and scalable server-side applications using Node.js. It is built with TypeScript.
It  easily integrate with other libraries like TypeORM for database interactions.

List of API’s:

User
* POST /api/users/login
* POST /api/users/register
* GET /api/users/all
* GET /api/users/logout

Item
* GET /api/menu/items/all
* POST /api/menu/items/create
* PUT /api/menu/items/update/{ID}
* DELETE /api/menu/items/delete/{ID}
* POST /api/menu/items/update_picture/{ID}
* DELETE /api/menu/items/delete_picture/{ID}

Category
* GET /api/menu/categories/all
* POST api/menu/categories/create
* PUT /api/menu/categories/update/{ID}
* DELETE /api/menu/categories/delete/{ID}
  
Blockchain interacting
<a href="https://docs.ethers.org/v6/" target="_blank">ethers</a> link.
The ethers.js library aims to be a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem.


## Ganache
Quickly fire up a personal Ethereum blockchain which used to run tests, execute commands, and inspect state while controlling how the chain operates.
<a href="https://trufflesuite.com/ganache/" target="_blank">Documentation</a> link.
Setting up a separate Ganache instance and interfacing with it programmatically test server.
Installation:
installed globally
```bash
npm install -g ganache-cli
```
Run the Script:
To start Ganache with workspace saving, run the script as before:
```bash
node startGanache.js
```
It will start on: http://localhost:8545 or http://127.0.0.1:8545

<a href="https://trufflesuite.com/ganache/" target="_blank">JSON-RPC API METHODS</a> is used.

Saving the Ganache workspace used -  to preserve the state of your blockchain environment across different sessions. 
Ganache CLI provides an option to save the state of test blockchain into a workspace.
--db option to the Ganache CLI command added to specify the directory where the workspace data will be saved

Pay attention, Ganache is a development tool, and the accounts and their balances are not real but are simulated for testing purposes.

## Tests

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
