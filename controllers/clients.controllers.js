const { where } = require("sequelize");
const { errorHandler } = require("../helpers/error_handler");
const Client = require("../models/clients");
const { clientValidation } = require("../validations/clients.validation");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const myJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const addClient = async (req, res) => {
  try {
    // Kiritilgan ma'lumotlarni konsolga chiqarish
    console.log("Request Body:", req.body);

    const { error, value } = clientValidation(req.body);

    if (error) {
      // Barcha xatoliklarni chiqarish
      return res.status(400).send({
        message: "Validation Errors",
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, email, password, phone_number, company_name,clientId } = value;
    console.log("Validated Data:", value);

    const hashedPassword = bcrypt.hashSync(password, 7);

    const activation_link = uuid.v4();

    const newClient = await Client.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      company_name,
      clientId,
      activation_link,
    });

    await mail_service.sendActivationMail(
      email,
      `${config.get("api_url")}:${config.get(
        "port"
      )}/api/client/activate/${activation_link}`
    );
    
    const payload = {
      id: newClient.id,
      email: newClient.email,
      is_expert: newClient.is_expert,
    };

    const tokens = myJwt.generateTokens(payload);

    newClient.token = tokens.refreshToken;
    await newClient.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Client  added",
      id: newClient.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({
      //ustozdan sorayman
      where: { email: email.toLowerCase() },
    });

    if (!client) {
      return res.status(400).send({
        message: "Email or password nor found ",
      });
    }

    const validPassword = bcrypt.compareSync(password, client.password);
    if (!validPassword) {
      return res.status(400).send({
        message: "Email and password nor found ",
      });
    }

    const payload = {
      _id: client._id,
      email: client.email,
      is_expert: client.is_expert,
    };

    const tokens = myJwt.generateTokens(payload);
    client.token = tokens.refreshToken;
    await client.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Client logged in",
      _d: client._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
const logoutClient = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(403)
        .send({ message: "Cookida refresh token topilmadi" });
    }

    const client = await Client.findOne({ where: { token: refreshToken } });

    if (!client) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    await client.update({ token: "" });

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
      return res.status(403).send({ message: "Refresh token topilmadi" });
    }

    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshsToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({ error: error.message });
    }

    const clientFromDB = await Client.findOne({
      where: { token: refreshToken },
    });
    if (!clientFromDB) {
      return res.status(403).send({
        message: "Ruhsat etilmagan foydalanuvchi (refresh token mos emas)",
      });
    }

    const payload = {
      id: clientFromDB.id,
      email: clientFromDB.email,
      is_expert: clientFromDB.is_expert,
    };

    const tokens = myJwt.generateTokens(payload);

    clientFromDB.token = tokens.refreshToken;
    await clientFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_ms"),
    });

    res.send({
      message: "Refresh token successfully updated",
      id: clientFromDB.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).send({
      message: "all clients fetched successfully",
      data: clients,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getClientsById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    console.log(req.client._id);

    if (id !== req.client._id) {
      return res
        .status(404)
        .send({ message: "Ruxsat etilmagan foydalanuvchi" });
    }

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).send({
        error: "Client not found",
      });
    }
    return res.status(200).send({
      message: "Client fetched successfully by ID",
      data: client,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getClientByPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const client = await Client.findOne({ where: { phone_number: phone } });
    if (!client) {
      return res.status(404).send({
        error: "Client not found",
      });
    }
    return res.status(200).send({
      message: "Client fetched successfully by phone_number",
      data: client,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number, is_active } = req.body;

    const [updated] = await Client.update(
      { name, phone_number, is_active },
      {
        where: { id },
        // returning: true,
        // plain: true,
      }
    );
    if (!updated) {
      return res.status(404).send({
        error: "Client not found or no changes made",
      });
    }
    return res.status(200).send({
      message: "Client updated successfully",
      data: updated,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).send({
        error: "Client not found",
      });
    }
    await client.destroy();
    return res.status(200).send({
      message: "Client deleted successfully",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const clientActivate = async (req, res) => {
  try {
    const link = req.params.link;
    const client = await Client.findOne({ active_link: link });
    if (!client) {
      return res.status(400).send({ message: "Bunday client topilmadi" });
    }

    if (client.is_active) {
      return res
        .status(400)
        .send({ message: "Bu client avval faollashtirilgan" });
    }

    client.is_active = true;
    await client.save();
    res
      .status(200)
      .send({ is_active: client.is_active, message: "Client faollashtirildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports = {
  addClient,
  loginClient,
  logoutClient,
  getAllClients,
  getClientsById,
  getAllClients,
  getClientByPhone,
  updateClient,
  deleteClient,
  refreshToken,
  clientActivate
};
