const Payment = require("../models/payments");


const addPayment = async (req, res) => {
  try {
    const { contract_id, amount, payment_date, status } = req.body;
    const newPayment = await Payment.create({
      contract_id,
      amount,
      payment_date,
      status,
    });
    res.status(201).send({ message: "Payment added", payment: newPayment });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).send({ payments });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get a payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }
    res.status(200).send({ payment });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update a payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { contract_id, amount, payment_date, status } = req.body;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }
    await payment.update({
      contract_id,
      amount,
      payment_date,
      status,
    });
    res.status(200).send({ message: "Payment updated", payment });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete a payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }
    await payment.destroy();
    res.status(200).send({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
