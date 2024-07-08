const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seats = sequelize.define('seats', {

    seat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seat_number: {
      type: DataTypes.STRING,
      allowNull: false,
  
    },
    screen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    theater_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    is_booked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

module.exports = Seats