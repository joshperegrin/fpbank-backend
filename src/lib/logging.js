// logger.js
const fs = require('fs');
const path = require('path');

// Path to log file
const logFilePath = './db/logs.txt';

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  // Log to console
  console.log(logEntry);

  // Append to file
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

module.exports = {logMessage};
