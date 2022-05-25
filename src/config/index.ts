import "dotenv-safe/config";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const PORT = process.env.PORT || 3000;

// Production Environment

export const isProd = process.env.NODE_ENV === "production";

export const MONGO_URI =
	process.env.MONGO_URI || "mongodb://localhost:27017/TaskScheduler_DB";

export const TEST_DATABASE = "mongodb://localhost:27017/TaskSchedulertest_DB";

export const SECRET_KEY =
	process.env.SECRET_KEY || "86544edc-0e13-4e11-af19-f216552d2ef4";

export const FRONTEND_URL = process.env.FRONTEND_URL;
