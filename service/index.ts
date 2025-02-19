import { ChildProcess, spawn } from "child_process";
import treeKill from "tree-kill";
import path from "path";
import { config } from "@/config";
import fs from "fs";
import { DATA_PATH } from "@/dashboard";

// Bot service management
export let botProcess: ChildProcess | null = null;
export const FEED_URL = "https://www.coindesk.com/arc/outboundfeeds/rss";

export const initService = () => {
  if (!fs.existsSync(DATA_PATH)) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const lastFetch = today.toISOString();

    const data: BotData = {
      lastFetch,
      feedUrl: FEED_URL,
      channels: [],
    };

    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    console.log("[SERVICE]", "Initialized successfully.");
  }
};

export const stopBotService = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!botProcess) {
      resolve();
      return;
    }

    // Use tree-kill to ensure all child processes are terminated
    treeKill(botProcess.pid!, (error) => {
      if (error) {
        console.error("Error killing process:", error);
      }
      botProcess = null;
      // Wait a moment to ensure the process is fully terminated
      setTimeout(resolve, 2000);
    });
  });
};

export const startBotService = async () => {
  await stopBotService();
  return new Promise<string>((resolve, reject) => {
    console.log("[SERVICE]", "Starting service...");
    const isWindows = process.platform === "win32";
    const isProduction = config.envirnoment === "production"; // Check if in production mode
    const tsNodeDevPath = path.join(
      process.cwd(),
      "node_modules",
      ".bin",
      isWindows ? "ts-node-dev.cmd" : "ts-node-dev"
    );

    const nodeProdPath = path.join(
      process.cwd(),
      "dist",
      "service",
      "service.js"
    ); // Path to the built JS file

    botProcess = spawn(
      isProduction ? "node" : tsNodeDevPath, // Use Node in production, ts-node-dev otherwise
      isProduction
        ? [nodeProdPath]
        : [
            "-r",
            "tsconfig-paths/register",
            "--respawn",
            "--transpile-only",
            "./service/service.ts",
          ],
      {
        stdio: ["pipe", "pipe", "pipe"],
        shell: true,
      }
    );
    if (!botProcess) {
      return reject();
    }

    botProcess.stdout?.on("data", (data) => {
      const message = data.toString() as string;

      if (message.includes("SERVICE STARTED")) {
        resolve(botProcess?.pid?.toString() ?? "0");
      }

      if (message)
        if (message.includes("Error: 401: Unauthorized")) {
          reject("Error: 401: Unauthorized");
        }
    });
    botProcess.on("exit", (code) => {
      console.log("[SERVICE]", "Service stoped with code:", code);
      botProcess = null;
      reject("Stoped");
    });

    botProcess.on("error", (error) => {
      console.error("[SERVICE]", "Service error:", error);
      reject("Error");
    });
  });
};
