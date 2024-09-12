
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const FreelancerSkill = require("./freel_skills");
const Freelancer = require("./freelancer");

const Skill = sequelize.define("skill", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});


FreelancerSkill.belongsTo(Skill)
Skill.hasMany(FreelancerSkill)
module.exports = Skill;