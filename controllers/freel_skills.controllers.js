const { errorHandler } = require("../helpers/error_handler");
const FreelancerSkill = require("../models/freel_skills");
const Skill = require("../models/skill");

const addFreelancerSkill = async (req, res) => {
  try {
    const { freelancer_id, skill_id } = req.body;
    const newFreelancerSkill = await FreelancerSkill.create({
      freelancer_id,
      skill_id,
    });
    res.status(201).send(newFreelancerSkill);
  } catch (error) {
    errorHandler(res, error);
  }
};

// --------------------------------GET-----------------------------------------------------------

const getAllFreelancerSkills = async (req, res) => {
  try {
    const freelancerSkills = await FreelancerSkill.findAll({
      include:Skill
    });
    res.status(200).send({
      message: "All freelancerSkills fetched successfully",
      data: freelancerSkills,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// ----------------------------------ByID------------------------------------
const getFreelancerSkillById = async (req, res) => {
  try {
    const id = req.params.id;
    const freelancerSkill = await FreelancerSkill.findByPk(id);
    if (!freelancerSkill) {
      return res.status(404).send({
        error: "FreelancerSkill not found!",
      });
    }
    return res.status(200).send({
      message: "FreelancerSkill fetched successfully by ID",
      data: freelancerSkill,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// ----------------------------PATCH-----------------------------
const updateFreelancerSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await FreelancerSkill.findByPk(id);
    if (!check) {
      return res.status(404).send({
        error: "FreelancerSkill not found!",
      });
    }
    const freelancerSkill = await FreelancerSkill.update(req.body, {
      where: { id },
      returning: true,
    });
    return res.status(200).send({
      message: "FreelancerSkill updated successfully",
      data: freelancerSkill[1][0],
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
// --------------------DELETE-------------------------------------
const deleteFreelancerSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await FreelancerSkill.findByPk(id);
    if (!check) {
      return res.status(404).send({
        error: "FreelancerSkill not found!",
      });
    }
    await FreelancerSkill.destroy;
    return res.status(200).send({
      message: "FreelancerSkill deleted successfully",
      date: FreelancerSkill,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addFreelancerSkill,
  getAllFreelancerSkills,
  getFreelancerSkillById,
  updateFreelancerSkill,
  deleteFreelancerSkill,
};
