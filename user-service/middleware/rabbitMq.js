const amqp = require('amqplib');
let channel, connection;
const ampq = process.env.RABBITMQ


async function connect() {
    try {
        connection = await amqp.connect(ampq);
        channel = await connection.createChannel();
        await channel.assertQueue('Queue',{ durable: false });
        await channel.assertQueue('Qu',{ durable: false });

    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
}

async function sendMessage(email_id, user_id) {
    try {
        if (!channel) {
            await connect();
        }
        const messageString = JSON.stringify({user_id: user_id,email:email_id});
        channel.sendToQueue('Queue', Buffer.from(messageString));
    } catch (error) {
        console.error('Error sending message to RabbitMQ', error);
    }
}

async function sendsms(phonenumber, otp) {
    try {
        if (!channel) {
            await connect();
        }
        const messageString = JSON.stringify({phonenumber: phonenumber,otp:otp});
        console.log(messageString)
        channel.sendToQueue('Qu', Buffer.from(messageString));
    } catch (error) {
        console.error('Error sending message to RabbitMQ', error);
    }
}

process.on('exit', () => {
    if (channel) {
        channel.close();
    }
    if (connection) {
        connection.close();
    }
});

module.exports = { connect, sendMessage,sendsms };