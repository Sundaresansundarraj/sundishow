const amqp = require('amqplib/callback_api');
const sendmail = require('../middleware/nodemail');
const sendOTP = require("../middleware/twiliosms")
const RABBITMQ = process.env.RABBITMQ



const startListenin = () => {
  amqp.connect(process.env.RABBITMQ, (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, ch) => {
      if (err) throw err;
      const queues = 'Queue';

        ch.assertQueue(queues, { durable: false });
      ch.consume(queues, async (msg) => {
        if (msg !== null) {
          const notificationInfo = JSON.parse(msg.content.toString());
          console.log(notificationInfo)
          sendmail(notificationInfo.email,notificationInfo.user_id)
          sendOTP(notificationInfo.phonenumber, notificationInfo.otp)
          ch.ack(msg);}})
      
     
    });
  });
};
const startListening = () => {
  amqp.connect(RABBITMQ, (err, conn) => {
    if (err) throw err;
    conn.createChannel((err, ch) => {
      if (err) throw err;
      const queues = 'Queue';
      const queue = 'Qu';
      if(queues){
        ch.assertQueue(queues, { durable: false });
      ch.consume(queues, async (msg) => {
        if (msg !== null) {
          const notificationInfo = JSON.parse(msg.content.toString());
          console.log(notificationInfo)
          sendmail(notificationInfo.email,notificationInfo.user_id)
          ch.ack(msg);}})
      }
      if(queue){
        ch.assertQueue(queue, { durable: false });
        ch.consume(queue, async (msg) => {
          if (msg !== null) {
            const notificationInfo = JSON.parse(msg.content.toString());
            console.log(notificationInfo)
            sendOTP(notificationInfo.phonenumber, notificationInfo.otp)
            ch.ack(msg);}})
      }
    });
  });
};

module.exports = { startListening};
