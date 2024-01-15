# Nilos 
 <!-- ![Logo](/docs/images/niloslogo.png) -->
<p align="center">
  <a href="https://www.nilos.io/" target="_blank"><img src="/docs/images/niloslogo.png" alt="Nilos IO" /></a>
</p>
  
# Task Description: 

## Web Service Overview

The application allows viewing and editing the restaurant menu through a web interface.

- Frontend: React + Axios
- Backend: Node.js + PostgreSQL + Prisma
- Authentication System: JWT-based

Demo video: TBC

## Table of Contents
- [Nilos](#nilos)
- [Task Description:](#task-description)
  - [Web Service Overview](#web-service-overview)
  - [Table of Contents](#table-of-contents)
  - [Ganache](#ganache)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Test](#test)


## Ganache
Quickly fire up a personal Ethereum blockchain which used to run tests, execute commands, and inspect state while controlling how the chain operates.
<a href="https://trufflesuite.com/ganache/" target="_blank">Documentation</a>
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
