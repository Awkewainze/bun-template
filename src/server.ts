import { serve } from "bun";
import index from "./index.html";
import { authRouter, NotFound } from "@/api";

const server = serve({
	routes: {
		...authRouter,

		// Invalid api calls
		"/api/*": async () => {
			return NotFound();
		},

		"/api/ws/connect": (req, server) => {
			server.upgrade(req, { data: {} });
		},

		// Serve index.html for remaining unmatched routes.
		"/*": index
	},

	development: process.env.NODE_ENV !== "production" && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},

	websocket: {
		open(ws) {

		},
		message(ws, message) {

		},
		close(ws, code, reason) {

		},
	},
});

process.on("SIGTERM", () => server.stop());

console.log("Runtime information");
console.log("Bun Version", Bun.version);
console.log("Bun Revision", Bun.revision);
console.log(`🚀 Server running at ${server.url}`);
