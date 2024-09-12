const { Router } = require("express");
const {
  addAdmin,
  getAllAdmins,
 getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshToken,
  adminActivate,
} = require("../controllers/admin.controllers");
const router = Router();
const adminPolice = require("../middleware/admin_police"); 
const creator_police = require("../middleware/creator_police");


router.post("/add",creator_police, addAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshToken);
router.get("/activate/:link", adminActivate);
router.get("/", adminPolice, getAllAdmins);
router.get("/:id", adminPolice, getAdminById);
router.put("/:id", adminPolice, updateAdmin);
router.delete("/:id", adminPolice, deleteAdmin);

module.exports = router;
