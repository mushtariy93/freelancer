const express = require("express");
const {
  addContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
} = require("../controllers/contract.controlles");

const router = express.Router();

router.post("/add", addContract);
router.get("/", getAllContracts);
router.get("/:id", getContractById);
router.put("/:id", updateContract);
router.delete("/:id", deleteContract);

module.exports = router;
