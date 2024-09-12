const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;

    
    if (!authorization) {
      return res.status(403).send({ message: "Token berilmagan" });
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return res.status(403).send({ message: "Token noto'g'ri" });
    }

    const [error, decodedToken] = await to(myJwt.verifyAccessToken(parts[1]));

    if (error) {
      return res.status(403).send({ message: error.message });
    }
    if (!decodedToken.is_creator) {
      return res.status(403).send({ message: "Foydalanuvchi creator emas" });
    }

    req.creator = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Xatolik yuz berdi" });
  }
};