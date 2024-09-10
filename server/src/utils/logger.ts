import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30",
});

// Events
// dailyRotateFileTransport.on('error', (error) => {
//   // Handle error
// });
// dailyRotateFileTransport.on('rotate', (oldFilename, newFilename) => {
//   // something to do
// });
// dailyRotateFileTransport.on('new', (newFilename) => {
//   // something to do
// });
// dailyRotateFileTransport.on('archive', (zipFilename) => {
//   // something to do
// });
// dailyRotateFileTransport.on('logRemoved', (removedFilename) => {
//   // something to do
// });

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [dailyRotateFileTransport],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      level: "info",
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
