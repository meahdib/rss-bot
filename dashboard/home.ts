import { Request, Response } from "express";

export const Home = (req: Request, res: Response) => {
  if (req.session.authenticated) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
};
