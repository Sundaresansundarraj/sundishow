const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Theater = sequelize.define('theater', {

    theater_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    theater_name: {
      type: DataTypes.STRING,
      allowNull: false,
  
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
  
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  
    },
  });

module.exports = Theater