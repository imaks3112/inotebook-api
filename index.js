const connectToDB = require('./db');
const express = require('express');

connectToDB();
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Welcome to Akshay World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})