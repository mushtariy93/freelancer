const { Router } = require("express");
const {
  addFreelancer,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
  loginFreelancer,
  logoutFreelancer,
  refreshTokenFreelancer,
  freelancerActivate,
} = require("../controllers/freelancer.controllers");

const freelancerPolice = require("../middleware/freelancer_police");

const router = Router();

router.post("/add",freelancerPolice, addFreelancer);
router.post("/login", freelancerPolice,loginFreelancer);
router.post("/logout", logoutFreelancer);
router.post("/refresh", refreshTokenFreelancer);
router.get("/activate/:link", freelancerActivate);

router.get("/",getAllFreelancers);
router.get("/:id", freelancerPolice, getFreelancerById);
router.put("/:id", freelancerPolice, updateFreelancer);
router.delete("/:id", freelancerPolice,deleteFreelancer);

module.exports = router;
