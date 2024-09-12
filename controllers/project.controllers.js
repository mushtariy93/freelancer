const Project = require("../models/project");
const { projectValidation } = require("../validations/project.validation");


const addProject = async (req, res) => {
  try {
    const { error, value } = projectValidation(req.body);
    if (error) {
      return res.status(400).send({
        message: "Validation Errors",
        errors: error.details.map((err) => err.message),
      });
    }

    const { client_id, title, description, budget, deadline, status, is_active } = value;

    const newProject = await Project.create({
      client_id,
      title,
      description,
      budget,
      deadline,
      status,
      is_active,
    });

    res.status(201).send({
      message: "Project added successfully",
      project: newProject,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).send({ projects });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }
    res.status(200).send({ project });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = projectValidation(req.body);
    if (error) {
      return res.status(400).send({
        message: "Validation Errors",
        errors: error.details.map((err) => err.message),
      });
    }

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    await project.update(value);
    res.status(200).send({ message: "Project updated", project });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    await project.destroy();
    res.status(200).send({ message: "Project deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  addProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
