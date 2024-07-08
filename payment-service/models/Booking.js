const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const user = require("../models/User")
const theater = require("../models/Theatre")
const screen = require("../models/Screen")
const seats = require("../models/Seat")
const Movie = require("../models/Movie")
const movieSlots = require("../models/MovieSlots")
const Payment = require("../models/Payment")

const Booking = sequelize.define('booking', {
    booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movie_slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    theater_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    screen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seat_id: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  
    ticket_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booking_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    payment_id: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
  });

  Booking.belongsTo(Movie, { foreignKey: 'movie_id' });
Booking.belongsTo(movieSlots, { foreignKey: 'movie_slot_id' });
Booking.belongsTo(user, { foreignKey: 'user_id' });
Booking.belongsTo(Payment, { foreignKey: 'payment_id' });
Booking.belongsTo(theater, { foreignKey: 'theater_id' });
Booking.hasMany(seats, { foreignKey: 'seat_id' });
Booking.belongsTo(screen, { foreignKey: 'screen_id' });
Movie.hasMany(Booking, { foreignKey: 'movie_id' });
user.hasMany(Booking, { foreignKey: 'user_id' });
Payment.hasMany(Booking, { foreignKey: 'payment_id' });

module.exports = Booking