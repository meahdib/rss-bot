import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN not defined");
}

export const config = {
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN,
};
