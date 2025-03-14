import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

// https://vite.dev/config/

export default defineConfig({
  server: {
    cors: true,
    host: "0.0.0.0",
    port: 5174,
    allowedHosts: [
      "dba0-2403-6200-88a3-e4f-e1f1-a336-ba6b-8150.ngrok-free.app",
    ], // เพิ่มโดเมนนี้เข้าไป
    https: {
      key: fs.readFileSync("../cert/server.key"),
      cert: fs.readFileSync("../cert/server.crt"),
      ca: fs.readFileSync("../cert/rootCA.crt"),
    },
  },

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
