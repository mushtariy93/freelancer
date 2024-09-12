
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Freelancer = require("./freelancer");

const FreelancerSkill = sequelize.define("freelancer_skill", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  freelancer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


module.exports = FreelancerSkill;
