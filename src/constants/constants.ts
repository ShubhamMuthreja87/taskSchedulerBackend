import { CookieOptions } from "express";
import { isProd } from "../config";

export const cookieConfig: CookieOptions = {
	// Doesnt allow Javascript to access the cookie
	httpOnly: true,
	// if true, Only send over HTTPS
	secure: true,
	maxAge: 1000 * 60 * 60 * 8, // 8 Hours
	// Same Domain
	sameSite: isProd ? "none" : "lax",
};
