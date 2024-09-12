const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Admin = sequelize.define("admin", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(15),
    unique: true,
    allowNull: false,
  },
  info: {
    type: DataTypes.TEXT,
  },
  photo: {
    type: DataTypes.STRING, 
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  is_creator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  token: {
    type: DataTypes.STRING(),
  },
});

module.exports = Admin;
