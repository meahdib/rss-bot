import dotenv from "dotenv";
import "../logger";
import { exit } from "process";
dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN not defined");
  exit(1);
}

if (!process.env.SECRET) {
  console.error("SECRET NOT DEFINED");
  exit(1);
}

export const config: Config = {
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN,
  service_name: process.env.SERVICE_NAME || "Unnamed service",
  dashboard_port: Number(process.env.DASHBOARD_PORT) || 3000,
  secret: process.env.SECRET,
  envirnoment: process.env.NODE_ENV || "development",
};
