const { Router } = require("express");
const { addProject, getAllProjects, getProjectById, updateProject, deleteProject } = require("../controllers/project.controllers");
const router = Router();

router.post("/add", addProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;

