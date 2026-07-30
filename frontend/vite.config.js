import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxies /api requests to the local backend during development,
// mirroring the nginx reverse proxy used in the production container.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
