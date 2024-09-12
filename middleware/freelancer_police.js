const myJwt = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).send({ message: "Token not provided" });
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(403).send({ message: "Invalid token format" });
    }

    const decodedToken = await myJwt.verifyAccessToken(token);
    req.freelancer = decodedToken;
    next();
  } catch (error) {
    res.status(403).send({ message: "Access denied" });
  }
};
