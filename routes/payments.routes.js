

const { Router } = require("express");
const router=Router()
const {
  addPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/payment.controllers");


router.post("/add", addPayment); 
router.get("/", getAllPayments); 
router.get("/:id", getPaymentById); 
router.put("/:id", updatePayment); 
router.delete("/:id", deletePayment); 

module.exports = router;
