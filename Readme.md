# Flash Wiz

Flash Wiz is a full-stack flashcard application built using the **PERN** stack (PostgreSQL, Express, React, Node.js). This README provides instructions on how to set up and run the app locally.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Server Setup](#2-server-setup)
  - [3. Client Setup](#3-client-setup)
- [Running the Application](#running-the-application)
- [Tutorial Reference](#tutorial-reference)
- [Technologies Used](#technologies-used)
- [Repository Links](#repository-links)

## Prerequisites

Make sure you have the following software installed:
- **Node.js** (v14 or above)
- **PostgreSQL**

## Setup Guide

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/kpbhumika/flashWiz.git
cd flashWiz
```

### 2. Server Setup

Navigate to the server folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the server directory to store environment variables. Include the following variables:


### 3. Client Setup

Navigate to the client folder and install dependencies:

```bash
cd ../client
npm install
```

## Running the Application

Once setup is complete, you can start both the server and client applications.

### Start the Server

1. In a terminal, navigate to the `server` folder:

    ```bash
    cd server
    ```

2. Start the server:

    ```bash
    npm start
    ```

   The server will run on `http://localhost:9000`.

### Start the Client

1. In a separate terminal window, navigate to the `client` folder:

    ```bash
    cd client
    ```

2. Start the client:

    ```bash
    npm start
    ```

   The client will run on `http://localhost:3000`.

## Tutorial Reference

This application was set up following the tutorial [“Get Started with the PERN Stack”](https://medium.com/@ritapalves/get-started-with-the-pern-stack-an-introduction-and-implementation-guide-e33c55d09994) by Rita Palves. The tutorial provides a comprehensive guide to building a full-stack application with the PERN stack and was used as a reference to structure both the backend and frontend of Flash Wiz.

## Technologies Used

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, JavaScript
- **Others**: CORS, Dotenv

## Heroku Deploy

Biuld frontend changes: 
1. go to client folder give command
   ```yarn build```
2. commit the changes local main.
3. Login to heroku and do
   ```git push heroku main```
  

## Repository Links

- **[GitHub Repository](https://github.com/kpbhumika/flashWiz)**
- **[Issues](https://github.com/kpbhumika/flashWiz/issues)**
