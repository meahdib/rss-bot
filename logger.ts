import fs from "fs";

const originalLog = console.log.bind(console); // Preserve the original context
const cyan = "\x1b[36m"; // Cyan color
const gray = "\x1b[90m"; // Updated to brighter gray color
const reset = "\x1b[0m"; // Reset color
const red = "\x1b[31m"; // Red color

const LOG_DIR = "./data";

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

console.error = (...args: any[]) => {
  originalLog(
    `${red}[ERROR]${gray}[${new Date().toUTCString()}]${reset}`,
    ...args
  );
};

console.log = (...args: any[]) => {
  const logFilePath = `${LOG_DIR}/log.json`;
  const logEntry = {
    timestamp: new Date().toUTCString(),
    message: args as string[],
  };

  if (logEntry.message.includes("[SERVICE]")) {
    // Read existing logs
    let logs = [];
    if (fs.existsSync(logFilePath)) {
      const logData = fs.readFileSync(logFilePath, "utf-8");
      logs = JSON.parse(logData);
    }

    // Add new log entry
    logs.push(logEntry);

    if (logs.length > 10) {
      logs = logs.slice(-10); // Keep only the last 10 logs
    }

    // Write updated logs back to the file
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
  }
  originalLog(
    `${cyan}[LOG]${gray}[${new Date().toUTCString()}]${reset}`,
    ...args
  );
};

console.table = (...args: any[]) => {
  originalLog(...args); // Call the original console.log for table output
};

export {};
