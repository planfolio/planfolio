// backend/src/db.js
require('dotenv').config();                 
const mysql = require('mysql2/promise');

async function getConnection() {
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
  });
  return connection;
}

module.exports = getConnection;
