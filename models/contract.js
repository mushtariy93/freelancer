const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./project");

const Contract = sequelize.define("contract", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  freelancer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "freelancers",
      key: "id",
    },
    allowNull: false,
  },
  project_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "projects", // Assuming you have a 'projects' table
      key: "id",
    },
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Contract.belongsTo(Project);
Project.hasMany(Contract);

module.exports = Contract;
