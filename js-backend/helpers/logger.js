const { createLogger, transports, format } = require("winston");

let winstonFormat = format.combine(
  format.json(),
  format.prettyPrint(),
  format.colorize(),
  format.errors({ stack: true })
);

if (process.env.NODE_ENV === "production") {
  winstonFormat = format.json();
}

const logger = createLogger({
  format: winstonFormat,
  transports: [
    new transports.File({
      filename: "logs/info.log",
      level: "info",
    }),
    new transports.Console({
      level: "info",
    }),
  ],
  exceptionHandlers: [
    new transports.File({ level: "error", filename: "logs/exceptions.log" }),
    new transports.Console({
      level: "error",
    }),
  ],
});

module.exports = logger;
