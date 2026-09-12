import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "https://helpdesk-ticket-system-umg4.onrender.com,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
};

app.use(
  cors(corsOptions)
);
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tickets", ticketRoutes);

app.use(errorHandler);

export default app;