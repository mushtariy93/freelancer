
const config = require("config");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, prettyPrint, json, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});
const logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(colorize(), format.simple()),
    }),
    new transports.File({
      filename: "log/error.log",
      level: "error",
      handleExceptions: true,
      handleRejections: true,
    }),
    new transports.File({
      filename: "log/combaine.log",
      level: "debug",
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});
logger.exitOnError = false;
// logger.exceptions.handle(new transports.File({ filename: ".log/exceptions.log" }));
// logger.rejections.handle(new transports.File({ filename: ".log/rejections.log" }));
module.exports = logger;
