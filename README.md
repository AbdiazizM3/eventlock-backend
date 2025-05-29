# Eventlock API

Eventlock is a backend API designed to simulate real-world application data handling, providing a structured and scalable foundation for backend services.

---

# Hosted Version

API URL: https://lokit.onrender.com/

---

# Getting Started

Clone the Repository

git clone https://github.com/AbdiazizM3/lokit-backend
cd lokit-backend

Install Dependencies

npm install

---

# Environment Setup

Create the following environment configuration files:

.env.development

.env.test

Each file should include the following environment variables:

PGDATABASE=DATABASE_NAME
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

There must be no spaces or quotation marks for the variable, this may cause issues such as being unable to connect to the database or your email.

---

# Database Setup

Finally run the commands:

npm run setup-dbs

npm run seed

These commands will create the database, once the database is setup it can be seeded if the database can be connected to successfully.

Ensure that the PGDATABASE name matches the name in the setup.sql file so that the database can be connected to properly.

---

Once everything above has been done run the following command in the terminal:

npm test

This runs all tests and if they all pass you have successfully setup the backend.

---

# Requirements

Node.js: v22.9.0 or higher

PostgreSQL: v17 or higher

---
