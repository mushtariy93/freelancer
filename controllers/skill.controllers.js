// controllers/skill.controller.js
const { errorHandler } = require("../helpers/error_handler");
const Skill = require("../models/skill");

// Add Skill
const addSkill = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newSkill = await Skill.create({
      name,
      description,
    });
    res.status(201).send(newSkill);
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get All Skills
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll();
    res.status(200).send({
      message: "All skills fetched successfully",
      data: skills,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Get Skill By ID
const getSkillById = async (req, res) => {
  try {
    const id = req.params.id;
    const skill = await Skill.findByPk(id);
    if (!skill) {
      return res.status(404).send({
        error: "Skill not found!",
      });
    }
    return res.status(200).send({
      message: "Skill fetched successfully by ID",
      data: skill,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Update Skill
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await Skill.findByPk(id);
    if (!check) {
      return res.status(404).send({
        error: "Skill not found!",
      });
    }
    const skill = await Skill.update(req.body, {
      where: { id },
      returning: true,
    });
    return res.status(200).send({
      message: "Skill updated successfully",
      data: skill[1][0],
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// Delete Skill
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await Skill.findByPk(id);
    if (!check) {
      return res.status(404).send({
        error: "Skill not found!",
      });
    }
    await Skill.destroy({ where: { id } });
    return res.status(200).send({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
