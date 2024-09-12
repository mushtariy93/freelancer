const { DataTypes, BelongsTo } = require("sequelize");
const sequelize = require("../config/db");
const Client = require("./clients");

const Project = sequelize.define(
  "project",
  {
   
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true, 
  }
);

Project.belongsTo(Client)
Client.hasMany(Project)

module.exports = Project;
