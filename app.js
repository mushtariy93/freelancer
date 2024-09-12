const express = require("express");
const config = require("config");
const sequelize = require("./config/db");
const cookieParser = require("cookie-parser");

const mainRouter = require("./routes/index.routes");

const logger=require("./services/logger_service")


logger.log("info", "Oddiy logger");
logger.error("error logger");
logger.debug("Debug logger");
logger.warn("Warn logger");
logger.info("Info logger");

const PORT = config.get("port");


const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/api", mainRouter);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server startet at http://localhost :${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
