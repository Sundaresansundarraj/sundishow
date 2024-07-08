const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {

    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING,
    },
    stripe_payment_id: {
      type: DataTypes.STRING,
    },
    uuid: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

module.exports = Payment

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Payment = sequelize.define('Payment', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   amount: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   currency: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: 'pending',
//   },
//   stripePaymentIntentId: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
// });

// sequelize.sync();

// module.exports = Payment;
