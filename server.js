const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')

const sequelize = require('./util/database');
const susbscriptionRoutes = require('./routes/subscription')

const app = express()

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST'
  );
  next();
});

app.use(susbscriptionRoutes)

app.use((req, res, next) => {
  res.status(404).json({ message: 'Please use the available API correctly !'});
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


const PORT = process.env.PORT || 3000

sequelize
.sync()
.then(() => {
  app.listen(PORT)
  console.log(`Server is listening on port ${PORT} !`)
})
.catch(err => {
  console.log(err);
})
 
