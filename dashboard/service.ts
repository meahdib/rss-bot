import { startBotService, stopBotService } from "@/service";
import { Request, Response } from "express";
import { UpdateServicePID } from ".";
import { DATA_PATH } from ".";
import fs from "fs";

export const RestartService = async (req: Request, res: Response) => {
  await startBotService()
    .then(async (pid) => {
      await UpdateServicePID(pid);

      res.redirect("/dashboard");
    })
    .catch(async () => {
      await UpdateServicePID(null);
      res.send("error!");
    });
};

export const StopService = async (req: Request, res: Response) => {
  await stopBotService();
  await UpdateServicePID(null);
  res.redirect("/dashboard");
};

export const UpdateService = async (req: Request, res: Response) => {
  const { feedUrl } = req.body;

  const data: BotData = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  data.feedUrl = feedUrl;
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  await startBotService();
  res.redirect("/dashboard");
};
