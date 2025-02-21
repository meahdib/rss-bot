import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import { config } from "@/config";
import { initService, startBotService } from "@/service";

export const CONFIG_DIR = "./data";
export const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");
export const DATA_PATH = path.join(CONFIG_DIR, "data.json");
export const LOG_PATH = path.join(CONFIG_DIR, "log.json");

export const Init = () => {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR);
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    const defaultConfig: ConfigData = {
      username: "admin",
      password: bcrypt.hashSync("admin", 10),
      processPID: null, // not started
      botToken: config.telegram_bot_token || "",
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
  }
  initService();
};

export const ChangeUserPassword = (
  currentPassword: string,
  newPassword: string
) => {
  const config: ConfigData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

  if (bcrypt.compareSync(currentPassword, config.password)) {
    config.password = bcrypt.hashSync(newPassword, 10);
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } else {
    return false;
  }
};

export const UpdateBotConfig = async (
  newBotToken: string
): Promise<boolean> => {
  const config: ConfigData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  config.botToken = newBotToken;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

  try {
    const pid = await startBotService();
    await UpdateServicePID(pid);
    return true;
  } catch (txt) {
    await UpdateServicePID(null);
    return false;
  }
};

export const UpdateServicePID = async (pid: string | null) => {
  const config: ConfigData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  config.processPID = pid;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
};
