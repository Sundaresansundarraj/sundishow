const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
    movie_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.DATE,
    },
    duration: {
      type: DataTypes.STRING,
    },
    theater_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    screen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  
  });

module.exports = Movie