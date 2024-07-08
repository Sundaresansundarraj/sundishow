require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const theatreRouter = require("./routes/theatre-router")

const app = express();
app.use(express.json());
app.use(theatreRouter);

const PORT = process.env.PORT

sequelize.sync()
  .then(() => {
    console.log('connection established sucessfully');
  })
  .catch((e) => {
    console.log(e);
  });
sequelize.authenticate()
  .then(() => {
    console.log('connection established sucessfully');
  })
  .catch((err) => {
    console.log('error', err);
  });
app.listen(PORT, () => {
  console.log(`port listned at ${PORT}`);
});
