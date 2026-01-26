import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	preview: {
		allowedHosts: true,
	},
	server: {
		allowedHosts: true,
		host: true, // Listen on all addresses (0.0.0.0)
		proxy: {
			"/api": {
				target: "http://127.0.0.1:3000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
