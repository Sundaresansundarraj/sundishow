const service = require("../services/payment-service.js")
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Response = require("../response/Response.js")
const  Sequelize  = require('sequelize');
const user = require("../models/User")
const theater = require("../models/Theatre")
const screen = require("../models/Screen")
const seats = require("../models/Seat")
const Movie = require("../models/Movie")
const movieSlots = require("../models/MovieSlots")
const Payment = require("../models/Payment")
const booking = require("../models/Booking.js")
const Csv = require("../middleware/csvReport.js")



class Controller {
   
        static async PaymentController(req, res, next) {
            try {
    
                const result = await service.paymentService(req)
    
                if (!result.success) {
                   
                    return Response.error(req, res, result.status, null, result.message)
                }
               
                return Response.sucess(req, res, result.status, result.data, result.message)
    
            }
            catch (err) {
               
                next(err)
            }
        }

    static async successPayment(req, res, next) {
        try {
            const uuid = req.query.u_id;
            console.log(uuid);
    
            const paymentDetails = await Payment.findOne({ where: { uuid } });
            if (!paymentDetails) {
                return res.status(404).json({ status: 404, message: "Payment details not found" });
            }
    
            const { stripe_payment_id: stripeId, booking_id: bookingId, payment_id: paymentId } = paymentDetails.dataValues;
    
            const sessionDetails = await stripe.checkout.sessions.retrieve(stripeId);
            if (!sessionDetails) {
                return res.status(404).json({ status: 404, message: "Stripe session not found" });
            }

            const updatePaymentDetails = {
                order_status: "confirmed",
                payment_status: sessionDetails.payment_status,
                payment_method: sessionDetails.payment_method
            };
            const updatePayment = await Payment.update(updatePaymentDetails, { where: { uuid } });
    
    
            const movieBookingDetails = {
                booking_status: "booked",
                payment_id: paymentId
            };
            await booking.update(movieBookingDetails, { where: { booking_id: bookingId } });
    
            const movieDetails = await booking.findOne({ where: { booking_id: bookingId } });
            if (!movieDetails) {
                return res.status(404).json({ status: 404, message: "Movie details not found" });
            }
    
            const seatIds = movieDetails.dataValues.seat_id;
    
            for (const seat of seatIds) {
                await seats.update({ is_booked: true }, { where: { seat_id: seat } });
            }
    
            const { user_id: userId, movie_id: movieId, theater_id: theaterId, screen_id: screenId, movie_slot_id: movieSlotId } = movieDetails.dataValues;
    
            const userDetails = await user.findOne({ where: { user_id: userId } });
            const movie = await Movie.findOne({ where: { movie_id: movieId } });
            const movieSlotDetails = await movieSlots.findOne({ where: { movie_slot_id: movieSlotId } });
            const theaterDetails = await theater.findOne({ where: { theater_id: theaterId } });
            const screenDetails = await screen.findOne({ where: { screen_id: screenId } });
    
            const seatNumbers = [];
            for (const seat of seatIds) {
                const seatDetails = await seats.findOne({ where: { seat_id: seat } });
                seatNumbers.push(seatDetails.dataValues.seat_number);
            }
            const seatNumber = seatNumbers.join(' ');
    
 
            const reduceTicketCount = movieSlotDetails.dataValues.available_seats - movieDetails.dataValues.ticket_count;
            await movieSlots.update({ available_seats: reduceTicketCount }, { where: { movie_slot_id: movieSlotId } });
    
            const ticketBookingDetails = {
                userId,
                userName: userDetails.dataValues.user_name,
                emailId: userDetails.dataValues.email_id,
                phoneNumber: userDetails.dataValues.phone_number,
                theaterName: theaterDetails.dataValues.theater_name,
                location: theaterDetails.dataValues.location,
                screenName: screenDetails.dataValues.screen_name,
                seatNumber,
                movieTitle: movie.dataValues.movie_title,
                releaseDate: movie.dataValues.release_date,
                duration: movie.dataValues.duration,
                movieSlotId,
                movieStartTime: movieSlotDetails.dataValues.start_time,
                movieEndTime: movieSlotDetails.dataValues.end_time,
                ticketCount: movieDetails.dataValues.ticket_count,
                bookingId,
                bookingStatus: movieDetails.dataValues.booking_status,
                paymentId,
                transactionId: sessionDetails.id,
                totalAmount: sessionDetails.amount_total,
                status: sessionDetails.amount_total,
                paymentIntent: sessionDetails.payment_intent,
                paymentMethodTypes: sessionDetails.payment_method_types,
                paymentStatus: sessionDetails.payment_status
            };
    
            console.log(ticketBookingDetails);
    
            let csvData = Csv.csvdata(ticketBookingDetails);
            let csvReport = Csv.csvreportGenerator(csvData);
    
            return res.status(200).json({
                status: 200,
                message: "Payment success",
                query: { sessionDetails, updatePayment }
            });
        } catch (err) {
            console.error("Error in successPayment: ", err);
            next(err);
        }
    }
    
    
    
        static async cancelPayment(req, res, next) {
            try {
                const uuid = req.query.u_id
    
                const payment_details = await Payment.findOne({
                    where: {
                        uuid: uuid
                    }
                })
    
                const stripeid = payment_details.dataValues.stripe_payment_id
    
                const bookingId = payment_details.dataValues.booking_id
    
              
    
    
                const paymentId = payment_details.dataValues.payment_id
    
              
    
    
    
    
                const sessionDeatils = await stripe.checkout.sessions.retrieve(stripeid
                );
               
    
                const updatePaymentDetails = {
                    order_status: "failed",
                    payment_status: sessionDeatils.payment_status,
                    payment_method: sessionDeatils.payment_method
                }
    
    
                const updatePayment = await Payment.update(updatePaymentDetails, { where: { uuid: uuid } })
    
    
              
    
                const moviebookingDetails = {
                    booking_status: "failed",
                    payment_id: paymentId
    
                }
    
               
                const movieDetails = await booking.findOne({
                    where: {
                        booking_id: bookingId
                    }
                })
    
                const deleteBookingDetails = await booking.destroy({
                    where: {
                        booking_id: bookingId
    
                    }
                })
    
    
                return res.status(400).json({
                    status: 400,
                    message: "payment was cancelled",
    
                })
    
            }
            catch (err) {
                console.log("error in cancel payments" + err)

                next(err)
            }
        }
    }
module.exports = Controller
    
    
    
    
    


