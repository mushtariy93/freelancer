const Freelancer = require("../models/freelancer");
const { errorHandler } = require("../helpers/error_handler");
const { where } = require("sequelize");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const {freelancerValidation} = require("../validations/freelancer.validation");
const FreelancerSkill = require("../models/freel_skills");

const addFreelancer = async (req, res) => {
  try {
    // Validate the request body
    const { error, value } = freelancerValidation(req.body);
    if (error) {
      return res.status(400).send({
        message: "Validation Errors",
        errors: error.details.map((err) => err.message),
      });
    }

    // Destructure values after validation
    const { name, email, password, phone, experience, rating, active_link } =
      value;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 7);

    // Create a new freelancer
    const newFreelancer = await Freelancer.create({
      name,
      email,
      password: hashedPassword,
      phone,
      experience,
      rating,
      active_link,
    });

    res
      .status(201)
      .send({ message: "Freelancer added", freelancer: newFreelancer });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};



const loginFreelancer = async (req, res) => {
  // Log the request body for debugging
  console.log("Request Body:", req.body);

  const { error } = freelancerValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ error: error.details.map((err) => err.message) });
  }

  const { email, password } = req.body;

  try {
    const freelancer = await Freelancer.findOne({ where: { email } });

    if (!freelancer) {
      return res.status(400).send({ message: "Email or password not found" });
    }

    const validPassword = bcrypt.compareSync(password, freelancer.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email and password not found" });
    }

    // Token generation logic
    const payload = { id: freelancer.id, email: freelancer.email };
    const tokens = myJwt.generateTokens(payload);
    freelancer.token = tokens.refreshToken;
    await freelancer.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Freelancer logged in",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};


const logoutFreelancer = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(403)
        .send({ message: "Refresh token not found in cookies." });
    }

    const freelancer = await Freelancer.findOne({
      where: { token: refreshToken },
    });

    if (!freelancer) {
      return res.status(400).send({ message: "Invalid refresh token." });
    }

    await freelancer.update({ token: "" });

    res.clearCookie("refreshToken");
    return res.status(200).send({ message: "Successfully logged out." });
  } catch (error) {
    errorHandler(res, error);
  }
};
const refreshTokenFreelancer = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(403).send({ message: "Refresh token not found." });
    }

    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({ error: error.message });
    }

    const freelancerFromDB = await Freelancer.findOne({
      where: { token: refreshToken },
    });
    if (!freelancerFromDB) {
      return res
        .status(403)
        .send({ message: "Unauthorized user (refresh token mismatch)." });
    }

    const payload = {
      id: freelancerFromDB.id,
      email: freelancerFromDB.email,
      is_expert: freelancerFromDB.is_expert,
    };

    const tokens = myJwt.generateTokens(payload);

    freelancerFromDB.token = tokens.refreshToken;
    await freelancerFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Refresh token successfully updated.",
      id: freelancerFromDB.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};


const getAllFreelancers = async (req, res) => {
  try {
    
    const freelancers = await Freelancer.findAll({
      include:FreelancerSkill
    });
    console.log(freelancers);
    res.status(200).send({ freelancers });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getFreelancerById = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancer = await Freelancer.findByPk(id);
    if (!freelancer) {
      return res.status(404).send({ message: "Freelancer not found" });
    }
    res.status(200).send({ freelancer });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateFreelancer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, experience, rating, active_link } = req.body;
    const freelancer = await Freelancer.findByPk(id);
    if (!freelancer) {
      return res.status(404).send({ message: "Freelancer not found" });
    }
    await freelancer.update({ name, phone, experience, rating, active_link });
    res.status(200).send({ message: "Freelancer updated", freelancer });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteFreelancer = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancer = await Freelancer.findByPk(id);
    if (!freelancer) {
      return res.status(404).send({ message: "Freelancer not found" });
    }
    await freelancer.destroy();
    res.status(200).send({ message: "Freelancer deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const freelancerActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const freelancer = await Freelancer.findOne({ active_link: link });
    if (!freelancer) {
      return res.status(400).send({ message: "Bunday freelancer topilmadi" });
    }

    if (freelancer.is_active) {
      return res
        .status(400)
        .send({ message: "Bu freelancer avval faollashtirilgan" });
    }

    freelancer.is_active = true;
    await freelancer.save();
    res
      .status(200)
      .send({ is_active: freelancer.is_active, message: "freelancer faollashtirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addFreelancer,
  loginFreelancer,
  logoutFreelancer,
  refreshTokenFreelancer,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
  freelancerActivate
};
