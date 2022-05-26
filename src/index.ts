// Load environment config
import { PORT } from "./config";

import { dbConnect } from "./utils/database";

import app from "./app";


const main = async () => {
	try {
		// Database Connection
		dbConnect();
		console.log(Date())
		console.log("[⚡] Connected to Database");
	} catch (err) {
		console.error("[❌] Failed to connect to Database.");
	}


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
