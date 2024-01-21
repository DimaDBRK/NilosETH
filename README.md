# Nilos 
 <!-- ![Logo](/docs/images/niloslogo.png) -->
 Nilos create the future of Web 3 banking today! 
<p align="center">
  <a href="https://www.nilos.io/" target="_blank"><img src="/docs/images/niloslogo.png" alt="Nilos IO" /></a>
</p>

# Task Description: 

TODO: 
* Implement Ethereum account creation in account.service.ts
* Implement payment creation in payment.service.ts
* Define and implement reasonable test cases for account service in account.service.spec.ts
* Define and implement reasonable test cases for payment service in payment.service.spec.ts

<p align="center">
  <a href="https://ethereum.org/" target="_blank"><img src="/docs/images/ethlogo.png" alt="ethereum" /></a>
</p>

## Web Service Overview

- Backend: Nest.js + SQLite + ethers.js
- Blockchain: Ganache - personal Ethereum blockchain
- Tests: account.service and payment.service
- Frontend: React + Axios + MUI
- Authentication System: for demo on modules - passport-local, @nestjs/passport, @nestjs/jwt, passport-jwt

NestJS app containing three modules: 
* User 
* Account
* Payment. 

Via the API that is exposed with NestJS users can:
* create the record of themselves in the database;
* create multiple Ethereum accounts; 
* and make payments between accounts.

Demo video: <a href="https://www.youtube.com/" target="_blank">Youtube link</a>.

## Table of Contents
- [Nilos](#nilos)
- [Task Description:](#task-description)
  - [Web Service Overview](#web-service-overview)
  - [Table of Contents](#table-of-contents)
  - [Database](#database)
  - [Backend and API](#backend-and-api)
  - [Blockchain interacting:](#blockchain-interacting)
  - [Ganache](#ganache)
  - [.ENV](#env)
  - [Frontend](#frontend)
  - [Authentication](#authentication)
  - [Tests](#tests)
  - [Installation](#installation)
  - [Running the app](#running-the-app)

## Database

Database type is SQLite.
It is serverless database engine.
The <a href="/backend/ormconfig.json" target="_blank">ormconfig.json</a> file indicates that  NestJS application is configured to use a SQLite database.
"db" - the name of the SQLite database file. This file is located in the root of project directory.

Installation: If you don't have SQLite installed on your system, you'll need to install it. Often just need the SQLite library which is usually included in most operating systems by default.

Database Tool: For a more visual approach, you might want to use a database tool that supports SQLite, like DB Browser for SQLite, to view and interact database directly.

There are Tables:

User 
* id: number - @PrimaryColumn => Added @PrimaryGeneratedColumn()
* username: string
* password: string
* accounts: Account[] - @OneToMany => Account

Account
* id: number - @PrimaryColumn => Added @PrimaryGeneratedColumn()
* publicKey: string
* privateKey: string
* user: User - @ManyToOne => User

Payment
* id: number - @PrimaryColumn
* from: Account - @ManyToOne(() => Account) - @JoinColumn({ name: 'from' })
* to: Account - @ManyToOne(() => Account) - @JoinColumn({ name: 'to' })
* amount: number - ('bigint')


## Backend and API

NestJS used. It is a popular framework for building efficient and scalable server-side applications using Node.js. It is built with TypeScript.
It  easily integrate with other libraries like TypeORM for database interactions.

List of API’s:

User
* GET  /user - list of all users => Added DTO
* GET /user/:id - single user info by ID => Added DTO
* POST /user - Creates a new user, payload (body) containing the user's data => added DTO to return ID & username

Added endpoints for UI demo:
* POST /auth/login - standard username and password check
* DELETE /user/:id - Remove the Relationship in Account table and delete user row


Account
* GET /account - list of all accounts.
* GET /account/:id - account  info by its ID.
* POST /account - creates a new account. The request JSON body containing the necessary user data - ID.


Payment
* GET /payment - list of all payment records. Added from and to (id + public account) in result.
* GET /payment/:id - single payment record by ID. Added from and to (id + public account) in result.
* POST /payment - Creates a new payment record. The request body structure defined in CreatePaymentDto. Added Payment Dto (excluded PrivateKey) from and to (id + public account) in result.
  Additionally - Implement logging for errors.
Added endpoints for test & demo:
* POST /payment/funding - fund app account (by ID) from test  (Ganache) account by Privatekey
* POST /payment/balance - check balance of accounts (arr od ID's)

Swagger (OpenAPI specification):

NestJS SwaggerModule automatically reflects all endpoints.
While the application is running, open your browser and navigate to http://localhost:3000/api
To generate and download a Swagger JSON file, navigate to http://localhost:3000/api-json

<a href="https://docs.nestjs.com/openapi/introduction" target="_blank">Documentation</a> link.


## Blockchain interacting:

<a href="https://docs.ethers.org/v6/" target="_blank">ethers</a> link.
The ethers.js library aims to be a complete and compact library for interacting with the Ethereum Blockchain and its ecosystem.

New Account creation:
The ethers library, when used with Wallet.createRandom(), generates a new Ethereum wallet (which includes a public-private key pair) independently of the Ethereum network or any node you are connected to (Ganache in this app).

There will not be new account in Ganache API request - get all accounts.

It's creating an Ethereum wallet with a new public-private key pair, but this wallet is not being "registered" or "created" on the Ganache blockchain. Instead, it exists as a standalone entity. In Ethereum, wallets don't need to be registered with the network; their existence is implicit. When a wallet interacts with the blockchain (like sending a transaction), that's when it becomes part of the blockchain's state.

Funding Accounts: 
For the sending account to have sufficient Ether, you  need to use one of the pre-funded accounts provided by Ganache (for test - created 10 accounts with 1000 ETH).

## Ganache
Quickly fire up a personal Ethereum blockchain which used to run tests, execute commands, and inspect state while controlling how the chain operates.
<a href="https://trufflesuite.com/ganache/" target="_blank">Documentation</a> link.

Installation:

Option 1. GUI => Used in this APP
![Ganache](/docs/screens/ganache.jpg)
Download SW and install.
API requests also supported.
It will start on: http://localhost:7545 or http://127.0.0.1:7545

Option 2. There are limitations in this case, not all functions support =>  Additional settings needed. Setting up a separate Ganache instance and interfacing with it programmatically on test server.

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
But there is limitation:  It should preserve information like transactions, block numbers, and contract states. However, it's crucial to understand that this may not include the preservation of dynamically created accounts (those created after Ganache has started) across restarts. Accounts created through JSON-RPC API calls (e.g., personal_newAccount) during a session are typically not persisted across restarts of the Ganache instance, even with the --db option. If you create new accounts during a session and need these accounts available in subsequent sessions, you would typically need to script their recreation upon restart.

Pay attention, Ganache is a development tool, and the accounts and their balances are not real but are simulated for testing purposes.


## .ENV
dotenv package used
.env file include environment variables:
GANACHE_URL=http://localhost:7545
JWT_SECRET=AddYourSecretHere
JWT_EXPIRES_IN=600s

This file should be created in backend root directory.
Pay attention there is .env.test => settings for test cases only.

## Frontend
Pages and main components.
![Payment](/docs/screens/payment.jpg)
Main components:
* Homepage - Login and Register
* UserSpace - to show Users accounts cards, Add account, Show keys, make Payments, Fund Accounts from Ganache accounts (Private keys needed)
* Payments - table with all payments data

![AllPayments](/docs/screens/allpayments.jpg)
Nav bar:
* Logo with link to Home page
* UserSpace and Payments (if User Login) buttons
* Switch themes button
* User Avatar, Name 
* Log out in additional menu


## Authentication

Simple token-based authentication employs one token, which also stored in LocalStorage after LogIn and deleted after LogOut. Auth by username and password.


## Tests

Tests test cases for account service in account.service.spec.ts and for payment service in payment.service.spec.ts.


It's a combined unit and integration test that involves spawning a local blockchain at runtime and running tests on it. 

Before run start Ganache SW!
Modify .env.test (root backend directory) file => check keys for Ganache with test amount more 2 ETH to fund new test accounts.
jest.setup.js => file include dotenv import

Run: 
yarn run test


Used script in package.json => "test": "jest --config jest.config.js",

The jest-html-reporters plugin generates a test report, and Jest's coverage reporting generates a separate coverage report in HTML format.
File jest.config.js includes settings.

After running tests, you can find the test report at <a href="/backend/reports/test-report.html" target="_blank">test-report.html</a> in "reports" folder  and the coverage report at "coverage" folder.

account.service.ts:
![Accounttest](/docs/screens/accounttest.jpg)

Test cases list:
* Service Initialization Test
Title: 'should be defined (check Service is OK)'
* Ethereum Test Network Connectivity Test
Title: 'should connect to the Ganache (Ethereum test network)'
* Account Creation Test
Title: 'should create an Ethereum account'
* Account Creation with Non-existent User Test
Title: 'should throw NotFoundException when creating an account with a non-existent user ID'
* Account Retrieval Test
Title: 'should retrieve an existing account'
* Non-existent Account Retrieval Test
Title: 'should throw NotFoundException when retrieving a non-existent account'
* Accounts Listing Test
Title: 'should list all accounts'
* Handling Deleted User in Account Listing Test
Title: 'should handle listing accounts with a deleted user gracefully'

payment.service.ts:
![Paymenttest](/docs/screens/paymenttest.jpg)
Test cases list:
* Check Service Initialization: Ensures that the PaymentService is properly instantiated and defined.
* Connect to Ethereum Test Network: Tests the connection to the Ganache (Ethereum test network) and checks if it can retrieve the current block number.
* Fund 'From' Account from Ganache: Verifies that the 'from' account can be successfully funded from a specified Ganache account, and checks the balance after funding.
* Account Creation Verification: Confirms the creation of 'from' and 'to' accounts before testing payment functionalities.
* Payment Transaction Execution: Validates the successful execution of a payment transaction from the 'from' account to the 'to' account, checking the transaction's structure and final account balances.
* Insufficient Funds Error Handling: Tests the service's response when attempting to make a payment with insufficient funds in the 'from' account.

Standard Nest.JS test commands:

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```


## Installation
Clone the repository:

```bash
git clone REPO NAME
cd yourproject

Backend (server)
```bash
$ yarn install
```
Create .env file

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
Frontend (client)
.env file include PORT=3030

Install the dependencies for the React frontend:
```
cd ../frontend
npm install
```

Start the React development server:
```
npm start
```

Install and start GANACHE.

The server will run on http://localhost:3000. 
You can access the application by opening your web browser and navigating to http://localhost:3030.
