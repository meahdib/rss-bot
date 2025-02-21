import express, { Request, Response, NextFunction } from "express";
import { config } from "@/config";
import session from "express-session";
import FileStore from "session-file-store"; // Ensure you have this package installed
import { ChangePasswordForm, Login, LoginForm } from "@/dashboard/login";
import { Init } from "@/dashboard";
import { Dashboard } from "@/dashboard/dashboard";
import {
  RestartService,
  StopService,
  UpdateService,
} from "@/dashboard/service";
import { ChangePassword, LogOut, UpdateConfig } from "@/dashboard/account";
import { Home } from "@/dashboard/home";
import { stopBotService } from "./service";

declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
  }
}

const app = express();
const PORT = config.dashboard_port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/assets", express.static("assets"));

const FileStoreSession = FileStore(session); // Create a session store

// Update session middleware to use cookies
app.use(
  session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: new FileStoreSession({
      path: "./sessions",
      logFn: function () {},
      retries: 0,
    }), // Specify the path for session files
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: false,
      // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  })
);

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Init files
Init();

app.get("/", Home);

app.get("/login", LoginForm);

app.post("/login", Login);

app.get("/dashboard", requireAuth, Dashboard);

app.post("/update-config", requireAuth, UpdateConfig);

app.post("/restart-service", requireAuth, RestartService);

app.get("/change-password", requireAuth, ChangePasswordForm);

app.post("/change-password", requireAuth, ChangePassword);
app.post("/stop-service", requireAuth, StopService);

app.post("/update-service", UpdateService);

app.post("/logout", LogOut);

// Cleanup on server shutdown
process.on("SIGTERM", async () => {
  console.error("RELOAD");
  await stopBotService();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await stopBotService();
  process.exit(0);
});

process.on("SIGHUP", async () => {
  console.log("Reload....");
  await stopBotService();
  process.kill(process.pid, "SIGUSR2"); // Allow ts-node-dev to continue with the reload
});

app.listen(PORT, () => {
  console.log(`Dashboard running on http://localhost:${PORT} `);
});
