require('dotenv').config();
const express       = require('express');
const cookieParser  = require('cookie-parser');
const userRoutes    = require('./src/routes/user.routes');

const app  = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use('/', userRoutes);   // 또는 '/api'


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
