import mongoose from "mongoose";
import { MONGO_URI, TEST_DATABASE } from "../config";

// Connect to database
export const dbConnect = (): mongoose.Connection => {
	// If environment is test, connect to TEST database
	mongoose.connect(
		process.env.NODE_ENV === "test" ? TEST_DATABASE : MONGO_URI,
		{
			keepAlive: true,
		}
	);
	return mongoose.connection;
};

// Close the db connection
export const dbClose = (): Promise<void> => {
	return mongoose.disconnect();
};
