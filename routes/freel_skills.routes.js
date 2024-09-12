const express = require("express");
const {
  addFreelancerSkill,
  getAllFreelancerSkills,
  getFreelancerSkillById,
  updateFreelancerSkill,
  deleteFreelancerSkill,
} = require("../controllers/freel_skills.controllers");

const router = express.Router();

router.post("/add", addFreelancerSkill);
router.get("/", getAllFreelancerSkills);
router.get("/:id", getFreelancerSkillById);
router.put("/:id", updateFreelancerSkill);
router.delete("/:id", deleteFreelancerSkill);

module.exports = router;
