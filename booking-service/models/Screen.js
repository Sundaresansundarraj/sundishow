const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Theater = require("../models/Theatre")


const Screen = sequelize.define('screen', {

    screen_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    screen_name: {
      type: DataTypes.STRING,
      allowNull: false,
  
    },
    theater_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
  });

  // Theater.hasMany(Screen, { foreignKey: 'theater_id' });

// Screen.belongsTo(Theater, { foreignKey: 'theater_id' });

module.exports = Screen