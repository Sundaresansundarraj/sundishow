const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const user = require("../models/User")
const theater = require("../models/Theatre")
const screen = require("../models/Screen")

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
  
Movie.belongsTo(user, { foreignKey: 'admin_id' });
Movie.belongsTo(theater, { foreignKey: 'theater_id' });
Movie.belongsTo(screen, { foreignKey: 'screen_id' });

module.exports = Movie