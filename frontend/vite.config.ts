
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ============================================================
// VITE CONFIGURATION
// ============================================================

export default defineConfig({
  plugins: [react()],

  server: {
    host: "localhost",
    port: 5173,
    open: true,
  },

  build: {
    outDir: "dist",
    sourcemap: true,
  },
});

