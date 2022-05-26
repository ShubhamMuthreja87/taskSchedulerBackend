// Load environment config
import { PORT } from "./config";

import { dbConnect } from "./utils/database";

import app from "./app";
import { scheduleJob } from "./service/taskAllocator";


const main = async () => {
	try {
		// Database Connection
		dbConnect();
		console.log(Date())
		console.log("[⚡] Connected to Database");
	} catch (err) {
		console.error("[❌] Failed to connect to Database.");
	}

	scheduleJob();

	app.listen(PORT, () => {
		console.log(
			`[⚡] Server is up and running on http://localhost:${PORT}`
		);
	}).on("error", (err) => {
		console.error(err);
	});
};

main().catch((err) => {
	console.error(err);
});
