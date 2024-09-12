
const { Router } = require("express");
const { addSkill, getAllSkills, getSkillById, updateSkill, deleteSkill } = require("../controllers/skill.controllers");
const router = Router()


router.post("/add",addSkill);
router.get("/", getAllSkills);
router.get("/:id",getSkillById);
router.put("/:id",updateSkill);
router.delete("/:id",deleteSkill);

module.exports = router;



