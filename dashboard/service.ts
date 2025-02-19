import { startBotService, stopBotService } from "@/service";
import { Request, Response } from "express";
import { UpdateServicePID } from ".";

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
