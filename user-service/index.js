require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const userRouter = require("./routes/user-router")
const {connect} = require("./middleware/rabbitMq")
const {jj}= require("./middleware/otpexpries")

const app = express();
app.use(express.json());
app.use(userRouter);
jj.start()
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
  connect();
  
});

