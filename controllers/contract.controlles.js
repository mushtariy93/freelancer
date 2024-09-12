const { where } = require("sequelize");
const Contract = require("../models/contract");
const { contractValidation} = require("../validations/contract.validation");



const addContract = async (req, res) => {
  try {
    const { freelancer_id, project_id, start_date, end_date, status } =
      req.body;

    // Log the incoming request body for debugging
    console.log("Incoming request data:", req.body);

    // Validate required fields
    if (!freelancer_id || !project_id || !start_date || !status) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newContract = await Contract.create({
      freelancer_id,
      project_id,
      start_date,
      end_date,
      status,
    });

    res.status(201).send({ message: "Contract added", contract: newContract });
  } catch (error) {
    console.error("Error while adding contract:", error); // Log the error
    res
      .status(500)
      .send({ error: "An error occurred while adding the contract" });
  }
};


const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll();
    res.status(200).send({ contracts });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }
    res.status(200).send({ contract });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { freelancer_id, project_id, start_date, end_date, status } =
      req.body;
    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }
    await contract.update({
      freelancer_id,
      project_id,
      start_date,
      end_date,
      status,
    });
    res.status(200).send({ message: "Contract updated", contract });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }
    await contract.destroy();
    res.status(200).send({ message: "Contract deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
};
