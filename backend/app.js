// app.js
require('dotenv').config();                 
const express = require('express');
const getConnection = require('./src/db');

const app = express();
const port = process.env.PORT || 3000;

app.get('/health', async (req, res) => {
  try {
    const connection = await getConnection();              
    const [rows] = await connection.query('SELECT NOW() AS now');
    await connection.end();                               
    res.json({ status: 'ok', dbTime: rows[0].now });
  } catch (err) {
    console.error('DB 연결 오류:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

console.log('[DEBUG] ENV:', {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
