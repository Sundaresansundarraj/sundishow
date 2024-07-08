const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware')
require('dotenv').config();


const app = express();

const routes = {
    '/user':process.env.USER_API,
    '/theatre': process.env.THEATRE_API,
    '/screen': process.env.SCREEN_API,
    '/seat':process.env.SEAT_API,
    '/movie': process.env.MOVIE_API,
    '/booking':process.env.BOOKING_API,
    '/payment': process.env.PAYMENT_API,
    '/notification': process.env.NOTIFICATION_API
}


for(const route in routes){
    const target = routes[route];
    app.use(route,createProxyMiddleware({target}))}

app.listen(process.env.PORT, () => {
  console.log('API Gateway running on port 4000');
});
