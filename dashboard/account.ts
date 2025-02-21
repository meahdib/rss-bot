import { Request, Response } from "express";
import { ChangeUserPassword, UpdateBotConfig } from ".";

export const ChangePassword = (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const result = ChangeUserPassword(currentPassword, newPassword);

  if (result) {
    res.redirect("/dashboard");
  } else {
    res.send("Invalid current password");
  }
};

export const LogOut = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Sesion destruction error", err);
      return res.redirect("/dashboard");
    }
  });

  res.redirect("/login");
};

export const UpdateConfig = async (req: Request, res: Response) => {
  const newBotToken = req.body.botToken;
  await UpdateBotConfig(newBotToken);
  res.redirect("/dashboard");
};
