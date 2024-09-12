const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("payment", {
  contract_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "contracts", // Assuming a 'contracts' table
      key: "id",
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: "Amount must be a valid number",
      },
      min: {
        args: [0],
        msg: "Amount must be greater than 0",
      },
    },
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: "Payment date must be a valid date",
      },
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [["pending", "completed", "failed"]],
        msg: "Status must be either 'pending', 'completed', or 'failed'",
      },
    },
  },
});

module.exports = Payment;
