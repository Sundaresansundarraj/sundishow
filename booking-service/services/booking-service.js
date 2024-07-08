const booking = require("../models/Booking.js")
const Message = require("../messages/Message")
const Httpcode = require("../codes/httpCodes")
const sequelize = require("../config/database.js")
const validateuniqueSeatids = require("../middleware/unique.js")
const releaseSeatsAndCancelBooking = require("../middleware/destroy.js")
const { Op, Sequelize, json, literal } = require("sequelize")
const axios = require('axios');
const user = require("../models/User.js")
const Movie = require("../models/Movie.js")
const movieSlots = require("../models/MovieSlots.js")
const screen = require("../models/Screen.js")
const theater = require("../models/Theatre.js")
const seats = require("../models/Seat.js")
const USER_API = process.env.USER_API



class Service {
   static async bookingService(req) {
    try {
      const userId = req.user.user_id;
      const {
        movie_id, movie_slot_id, theater_id, screen_id, seat_id, ticket_count,
      } = req.body;

      console.log(seat_id)

      const prebookingChecks = await booking.findAll({
        where: {
          [Op.or]: seat_id.map(value => {
            return sequelize.where(
              sequelize.fn('JSON_CONTAINS', sequelize.col('seat_id'), JSON.stringify([value])),
              true
            );
          })
        },
        logging: console.log
      });

      console.log(">>>>>>>", prebookingChecks.length, prebookingChecks)

      if (prebookingChecks.length > 0) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[132]
        }
      }

      const token = req.headers['authorization'];

      const response = await axios.get(USER_API, {
        headers: {
            'Authorization': token
        }})

        const user = response.data
        const user_name = user.data.user_name
        const user_email = user.data.email_id
      

      // const user_details = await user.findOne({ where: { user_id: userId } });
      // console.log(user_details)

      const theater_exist = await theater.findOne({ where: { theater_id } });
      if (!theater_exist) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[117],
        };
      }
      const screen_exist = await screen.findOne({
        where: {
          screen_id: screen_id,
          theater_id: theater_id,
        },
      });

      if (!screen_exist) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[118],
        };
      }

      const movieexist = await Movie.findOne({ where: { movie_id } });

      if (!movieexist) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[105],
        };
      }

      const movieTheaterScreen = await Movie.findOne({
        where:
        {
          movie_id: movie_id,
          theater_id: theater_id,
          screen_id: screen_id


        }
      })
      if (!movieTheaterScreen) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[130],
        }
      }

      const movieSlotexist = await movieSlots.findOne({ where: { movie_slot_id } });

      if (!movieSlotexist) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[106],
        };
      }

      const movieSlot = await movieSlots.findAll({
        where:
        {
          movie_slot_id,
          movie_id,
        },
      });
      if (!movieSlot.length) {
        return {
          sucess: false,
          message: Message[108],
          status: Httpcode.HTTP_BAD_REQUEST,
        };
      }

      if (movieSlotexist.dataValues.available_seats < ticket_count) {
        return {
          sucess: false,
          status: Httpcode.HTTP_NOT_FOUND,
          message: Message[107],
        };
      }
      const uniqueSeatids = validateuniqueSeatids(seat_id)
      if (!uniqueSeatids) {
        return {
          sucess: false,
          status: Httpcode.HTTP_BAD_REQUEST,
          message: Message[131]
        }
      }
      const seatNumber = [];
      for (const seat of seat_id) {
        const seatNumberExist = await seats.findOne({
          where:
          {
            seat_id: seat,
            theater_id: theater_id,
            screen_id: screen_id
          }
        });


        if (!seatNumberExist) {
          return {
            sucess: false,
            status: Httpcode.HTTP_NOT_FOUND,
            message: Message[119],
          };
        }
        if (seatNumberExist.dataValues.is_booked == true) {
          return {
            sucess: false,
            status: Httpcode.HTTP_BAD_REQUEST,
            message: Message[120],
          };
        }
        seatNumber.push(seatNumberExist.dataValues.seat_number);
      }

      const single_ticket = movieSlotexist.dataValues.price;
      const sgst = 0.18 * single_ticket;
      const gst = 0.18 * single_ticket;
      const single_ticket_fare = Number(single_ticket + sgst + gst);
      const total_price = single_ticket_fare * ticket_count;

      const movie_details = {
        theater_id,
        theater_name: theater_exist.dataValues.theater_name,
        location: theater_exist.dataValues.location,
        screen_id,
        screen_name: screen_exist.dataValues.screen_name,
        seat_id,
        seat_number: seatNumber,
        // user_name: user_details.dataValues.user_name,
        // user_email: user_details.dataValues.email_id,
        user_name:user_name,
        user_email:user_email,
        movie_name: movieexist.dataValues.movie_title,
        movie_time: movieexist.dataValues.start_time,
        no_of_seats: ticket_count,
        single_ticket,
        sgst,
        gst,
        single_ticket_fare,
        total_price,
      };

      const ticket_booking_details = {
        movie_id,
        movie_slot_id,
        theater_id,
        screen_id,
        seat_id: seat_id,
        user_id: userId,
        ticket_count,
      };


      const bookingTimeouts = {}

      const ticket_booking = await booking.create(ticket_booking_details);
      const timeout = 15 * 60 * 1000

      const timeoutId = setTimeout(async () => {
        await releaseSeatsAndCancelBooking(ticket_booking.dataValues.booking_id)


      }, timeout);

      bookingTimeouts[ticket_booking.dataValues.booking_id] = timeoutId

      return {
        sucess: true,
        status: Httpcode.HTTP_OK,
        message: Message[209],
        data: {
          movie_details,
          ticket_booking,
          // timeoutId
        },
      };
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Service