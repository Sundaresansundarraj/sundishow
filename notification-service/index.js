require('dotenv').config();
const express = require('express');
const { startListening } = require('./services/notificationService');

const app = express();
app.use(express.json());


app.listen(process.env.PORT, () => {
  console.log(`Notification service running on port ${process.env.PORT}`);
  startListening();
});

