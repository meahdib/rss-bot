import { Request, Response } from "express";
import fs from "fs";
import bcrypt from "bcrypt";
import { config } from "@/config";

import { CONFIG_PATH } from ".";

export const LoginForm = (req: Request, res: Response) => {
  const err = req.query.err;

  res.status(200).send(`
         <!doctype html>
<html>

  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/assets/fav.png">      
           <script src="/assets/global.js"></script>
      <link rel="stylesheet" href="/assets/css/all.min.css" />
      title>${config.service_name} Dashboard</title>
  </head>

<body class="h-screen bg-gray-900">

<div class="flex flex-col justify-center items-center h-full">


<h1 class="text-4xl font-bold mb-16 text-center text-white">
    <i class="fas fa-dashboard"></i> ${config.service_name} Dashboard
</h1>

<div class="flex flex-col">
    <h2 class="text-xl font-bold mb-2 text-white"><i class="fas fa-shield-alt"></i> Login</h2>
    <form method="POST" action="/login" class="bg-gray-800 p-6 rounded shadow-md w-100">
        <div class="relative mb-4">
            <input type="text" name="username" placeholder="Username" required class="border border-gray-600 p-2 rounded w-full bg-gray-700 text-white pl-10" />
            <i class="fas fa-user absolute left-3 top-2.5 text-gray-400"></i>
        </div>
        <div class="relative mb-4">
            <input type="password" name="password" placeholder="Password" required class="border border-gray-600 p-2 rounded w-full bg-gray-700 text-white pl-10" />
            <i class="fas fa-lock absolute left-3 top-2.5 text-gray-400"></i>
        </div>
        <button type="submit" class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500 transition cursor-pointer">
            <i class="fas fa-sign-in-alt"></i> Login
        </button>
    </form>
        ${
          err
            ? `<div class="text-red-600 p-4 rounded mb-4 mt-5">
            <i class="fas fa-exclamation-triangle"></i> Invalid username or password. Please try again.
        </div>`
            : ""
        }
</div>
</body>
</html>
  `);
};

export const Login = (req: Request, res: Response) => {
  const config: ConfigData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  const { username, password } = req.body;

  if (
    username === config.username &&
    bcrypt.compareSync(password, config.password)
  ) {
    req.session.authenticated = true;
    console.log("user authenticated");
    req.session.save((err) => {
      // Force session save
      if (err) {
        console.error("Session save error:", err);
        return res.redirect("/login");
      }
      if (password === "admin") {
        res.redirect("/change-password");
      } else {
        res.redirect("/dashboard");
      }
    });
  } else {
    console.log("error username/password");
    res.redirect("/login?err=1");
  }
};

export const ChangePasswordForm = (req: Request, res: Response) => {
  res.send(`
    <!doctype html>
    <html>
     <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/assets/fav.png">      
           <script src="/assets/global.js"></script>
      <link rel="stylesheet" href="/assets/css/all.min.css" />
      title>${config.service_name} Dashboard</title>
  </head>
      <body class="h-screen bg-gray-900">
        <div class="flex flex-col justify-center items-center h-full">
          <h1 class="text-4xl font-bold mb-16 text-center text-white">
            <i class="fas fa-rss"></i> RSS Bot Dashboard
          </h1>
          <div class="flex flex-col">
            <h2 class="text-xl font-bold mb-2 text-white">
              <i class="fas fa-shield-alt"></i> Change Password
            </h2>
            <form method="POST" action="/change-password" class="mb-4 flex space-x-2 flex-wrap gap-4">
              <input type="password" name="currentPassword" placeholder="Current Password" required class="flex-1 border rounded p-2 bg-gray-700 text-white" />
              <input type="password" name="newPassword" placeholder="New Password" required class="flex-1 border rounded p-2 bg-gray-700 text-white" />
              <button type="submit" class="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer">
                <i class="fas fa-key"></i> Change Password
              </button>
            </form>
          </div>
        </div>
      </body>
    </html>
  `);
};
