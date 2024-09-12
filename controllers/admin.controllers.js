const { where } = require("sequelize");
const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../models/admin");
const { adminValidation } = require("../validations/admin.validation");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const addAdmin = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { error, value } = adminValidation(req.body);

    if (error) {
      return res.status(400).send({
        message: "Validation Errors",
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, email, password, phone, info } = value;
    console.log("Validated Data:", value);

    const hashedPassword = bcrypt.hashSync(password, 7);
    const activation_link = uuid.v4();

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      info,
      activation_link,
    });

    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/admin/activate/${activation_link}`
    );

    const payload = {
      id: newAdmin.id,
      email: newAdmin.email,
      is_creator: newAdmin.is_creator,
    };

    const tokens = myJwt.generateTokens(payload);

    newAdmin.token = tokens.refreshToken;
    await newAdmin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Admin added",
      id: newAdmin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return res.status(400).send({
        message: "Email or password not found",
      });
    }

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(400).send({
        message: "Invalid email or password",
      });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      is_creator: admin.is_creator,
    };

    const tokens = myJwt.generateTokens(payload);
    admin.token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Admin logged in",
      id: admin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(403)
        .send({ message: "Cookie refresh token not found" });
    }

    const admin = await Admin.findOne({ where: { token: refreshToken } });

    if (!admin) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    await admin.update({ token: "" });

    res.clearCookie("refreshToken");
    return res.status(200).send({ message: "Successfully logged out" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(403).send({ message: "Refresh token not found" });
    }

    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshsToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({ error: error.message });
    }

    const adminFromDB = await Admin.findOne({
      where: { token: refreshToken },
    });
    if (!adminFromDB) {
      return res.status(403).send({
        message: "Unauthorized admin (refresh token mismatch)",
      });
    }

    const payload = {
      id: adminFromDB.id,
      email: adminFromDB.email,
      is_creator: adminFromDB.is_creator,
    };

    const tokens = myJwt.generateTokens(payload);

    adminFromDB.token = tokens.refreshToken;
    await adminFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Refresh token successfully updated",
      id: adminFromDB.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAdmins = async (req, res) => {
  try {
     if (id != req.admin._id) {
      return res.status(403).send({
        statusCode: 403,
        message: "Unauthorized access",
      });
    }
    const admins = await Admin.findAll();
    res.status(200).send({
      message: "All admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAdminById = async (req, res) => {
  try {
    const id = req.params.id;

    if (id != req.admin._id) {
      return res.status(403).send({
        statusCode: 403,
        message: "Unauthorized access",
      });
    }
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).send({
        error: "Admin not found",
      });
    }
    return res.status(200).send({
      message: "Admin fetched successfully by ID",
      data: admin,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAdmin = async (req, res) => {
  try {

     if (id != req.admin._id) {
      return res.status(403).send({
        statusCode: 403,
        message: "Unauthorized access",
      });}

    const { id } = req.params;
    const { name, phone, is_active } = req.body;

    const [updated] = await Admin.update(
      { name, phone, is_active },
      {
        where: { id },
      }
    );
    if (!updated) {
      return res.status(404).send({
        error: "Admin not found or no changes made",
      });
    }
    return res.status(200).send({
      message: "Admin updated successfully",
      data: updated,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
     if (id != req.admin._id) {
      return res.status(403).send({
        statusCode: 403,
        message: "Unauthorized access",
      });}

    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).send({
        error: "Admin not found",
      });
    }
    await admin.destroy();
    return res.status(200).send({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
const adminActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const admin = await Admin.findOne({ active_link: link });
    if (!admin) {
      return res.status(400).send({ message: "Bunday admin topilmadi" });
    }

    if (admin.is_active) {
      return res
        .status(400)
        .send({ message: "Bu admin avval faollashtirilgan" });
    }

    admin.is_active = true;
    await admin.save();
    res
      .status(200)
      .send({ is_active: admin.is_active, message: "admin faollashtirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAdmin,
  loginAdmin,
  logoutAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  refreshToken,
  adminActivate,
};
