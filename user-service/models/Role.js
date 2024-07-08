const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require("./User")

const Role = sequelize.define('Role', {
    role: DataTypes.STRING,
  });
  User.belongsTo(Role, { foreignKey: 'role' });
  Role.hasMany(User, { foreignKey: 'role' });
module.exports = Role