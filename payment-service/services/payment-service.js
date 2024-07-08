
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { v4 } =require('uuid') ;
const message = require("../messages/Message")
const httpcodes = require("../codes/httpCodes")
const movieSlots = require("../models/MovieSlots")
const Payment = require("../models/Payment")
const booking = require("../models/Booking")

// const stripe = new Stripe(process.env.SECRET_KEY);
class Service {
  static async paymentService(req) {
    try {
      const {
        booking_id, amount, quantity, payment_method_types,
      } = req.body;

      const booking_id_exist = await booking.findOne({ where: { booking_id } });

      if (!booking_id_exist) {
        return {
          sucess: false,
          status: httpcodes.HTTP_NOT_FOUND,
          message: message[121],

        };
      }
      if (booking_id_exist.booking_status == 'booked') {
        return {
          sucess: false,
          status: httpcodes.HTTP_BAD_REQUEST,
          message: message[122],
        };
      }

      const product = await stripe.products.create({
        name: 'movie ticket',
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount,
        currency: 'inr',

      });
      const uuid = v4();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: [payment_method_types],
        line_items: [{
          price: price.id,
          quantity,
        }],
        mode: 'payment',
        success_url: `http://localhost:3000/payment_sucesss?u_id=${uuid}`,
        cancel_url: `http://localhost:3000/cancel_paymentu_id=${uuid}`,

      });
      

      if (session) {
        const payment_details = {
          total_amount: session.amount_total,
          payment_method: payment_method_types,
          stripe_payment_id: session.id,
          uuid,
          booking_id,

        };

        const paymentinfo = await Payment.create(payment_details);
        const session_Url = session.url;
        

        return {
          success: true,
          status: httpcodes.HTTP_OK,
          message: 'session created',
          data:
          {
            paymentinfo,
            session_Url,
          },

        };
      }

      return {
        success: false,
        status: httpcodes.HTTP_BAD_REQUEST,
        message: 'error while creating session',
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        status: httpcodes.HTTP_INTERNAL_SERVER_ERROR,
        message: 'error for creating session.',
      };
    }

  }

 static async sucessPaymentService(req, res) {
    try {
      const uuid = req.query.u_id;
      console.log(uuid)
      const payment_details = await Payment.findOne({
        where: {
          uuid,
        },
      });
      if (!payment_details) {
        return {
          sucess: false,
          status: httpcodes.HTTP_BAD_REQUEST,
          message: message[113],
        };
      }
      const stripeid = payment_details.dataValues.stripe_payment_id;
      const bookingId = payment_details.dataValues.booking_id;
      const paymentId = payment_details.dataValues.payment_id;
      const sessionDeatils = await stripe.checkout.sessions.retrieve(stripeid);
       console.log(bookingId)
      

      const updatePaymentDetails = {
        order_status: 'confirmed',
        payment_status: sessionDeatils.payment_status,
      };

      const updatePayment = await Payment.update(updatePaymentDetails, { where: { uuid } });

    

      const moviebookingDetails = {
        booking_status: 'booked',
        payment_id: paymentId,

      };
      const moviebooking = await booking.update(moviebookingDetails, {
        where: {
          booking_id: bookingId,
        },
      });

      const movieDetails = await booking.findOne({
        where: {
          booking_id: bookingId,
        },
      });

      const movieSlotId = movieDetails.dataValues.movie_slot_id;

      const movieSlotDetails = await movieSlots.findOne({
        where: {
          movie_slot_id: movieSlotId,
        },
      });


      const reduceTicketCount = (movieSlotDetails.dataValues.available_seats) - (movieDetails.dataValues.ticket_count);

      const updateTicketCount = await movieSlots.update({ available_seats: reduceTicketCount }, {
        where: {
          movie_slot_id: movieSlotId,

        },
      });
      if (!updateTicketCount) {
        return {
          sucess: true,
          status: httpcodes.HTTP_OK,
          message: message[212],
          data: sessionDeatils,
        };
      }

      
    } catch (err) {
      console.log(err);

      
    }
  }

 static async cancelPaymentService(req, res, next) {
    try {
      const uuid = req.query.u_id;
      const payment_details = await Payment.findOne({
        where: {
          uuid,
        },
      });
      const stripeid = payment_details.dataValues.stripe_payment_id;
      const bookingId = payment_details.dataValues.booking_id;
      const paymentId = payment_details.dataValues.payment_id;
      const sessionDeatils = await stripe.checkout.sessions.retrieve(stripeid);


      const updatePaymentDetails = {
        order_status: 'canceled',
        payment_status: sessionDeatils.payment_status,
      };
      const updatePayment = await Payment.update(updatePaymentDetails, { where: { uuid } });

      
      const moviebookingDetails = {
        booking_status: 'not booked',
        payment_id: paymentId,

      };
      const moviebooking = await booking.update(moviebookingDetails, {
        where: {
          booking_id: bookingId,
        },
      });
      return {
        sucess: false,
        status: httpcodes.HTTP_BAD_REQUEST,
        message: message[116],
        data: sessionDeatils,
      };
    
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Service



