const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const FreelancerSkill = require("./freel_skills");

const Freelancer = sequelize.define("freelancer", {
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
    allowNull: false,
    unique: true,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  active_link: {
    type: DataTypes.STRING(),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  
});

FreelancerSkill.belongsTo(Freelancer);
Freelancer.hasMany(FreelancerSkill);


module.exports = Freelancer;
