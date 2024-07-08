const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Movie = require("../models/Movie")

const MovieSlots = sequelize.define('movie_slots', {

    movie_slot_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
  
    },
    end_time: {
      type: DataTypes.TIME,
  
    },
    price: {
      type: DataTypes.INTEGER,
    },
    available_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  
  });
MovieSlots.belongsTo(Movie, { foreignKey: 'movie_id' });
Movie.hasMany(MovieSlots, { foreignKey: 'movie_id' });

module.exports = MovieSlots