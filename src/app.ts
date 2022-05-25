import { CelebrateError, isCelebrateError } from "celebrate";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import passport from "passport";

import { isProd } from "./config";

import ErrorCodes from "./constants/errors";

const app = express();

// Body Parser
app.use(express.json());

// Form Data
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Passport
app.use(passport.initialize());

// Use HTTP headers for security in Production
if (isProd) app.use(helmet());

// CORS Setup
const corsOrigins: string[] = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://task-scheduler-shubhammuthreja87.vercel.app",
  "https://task-scheduler-git-main-shubhammuthreja87.vercel.app",
  "https://task-scheduler-demo.vercel.app",
];
// Add FRONTEND_URL to CORS allowed origins in Production
// if (isProd && FRONTEND_URL) corsOrigins.push(FRONTEND_URL);

app.use(
  cors({
    origin: corsOrigins,
    // Accepts cookies
    credentials: true,
  })
);

// Allow Static Files. Used for HTTPS, .well-known
app.use(express.static(__dirname, { dotfiles: "allow" }));

// Routes
// Ping

app.get("/", (_req, res) => {

  return res.send("Hello world");
});

// Custom error handling middleware for returning errors in custom form:
// {
// 	code: ErrorCode,
// 	message: string,
// }

app.use(
  (
    error: CelebrateError | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // Check if error is a validation error
    if (isCelebrateError(error)) {
      return res.status(400).send({
        code: ErrorCodes.E0.code,
        message: ErrorCodes.E0.message,
        error: Object.fromEntries(error.details),
      });
    } else {
      return res.status(500).send({
        code: error.message || ErrorCodes.U1.code,
        message: ErrorCodes.U1.message,
      });
    }
  }
);

export default app;
