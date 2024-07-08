const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Screen