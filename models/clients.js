const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Client = sequelize.define(
  "client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255), // Adjust length as needed
    },
    phone_number: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    active_link: {
      type: DataTypes.UUID,
      allowNull: true, // Explicitly state it can be null
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING(500), // Adjust length as needed
    },
  },
  // {
  //   tableName: "Clients", // Explicitly specify the table name
  // }
);

module.exports = Client;

// const sequelize = require("../config/db");

// const { DataTypes } = require("sequelize");
// const Client = sequelize.define("client", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING(50),
//     unique: true,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING(255),
//   },
//   phone_number: {
//     type: DataTypes.STRING(15),
//     unique: true,
//     allowNull: false,
//   },
//   company_name: {
//     type: DataTypes.STRING(50),
//     unique: true,
//     allowNull: false,
//   },
//   active_link: {
//     type: DataTypes.UUID,
//     allowNull: true, // Explicitly state it can be null
//   },

//   is_active: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false,
//   },
//   token: {
//     type: DataTypes.STRING(500),
//   },
// });

// module.exports = Client;
