import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist",   // important if your server serves static files from ../dist
    emptyOutDir: true
  }
});
