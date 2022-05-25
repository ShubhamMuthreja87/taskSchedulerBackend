import { CurrentUser } from "../user";

declare global {
	namespace Express {
		export interface Request {
			currentUser: Partial<CurrentUser> | null;
		}
	}
}
