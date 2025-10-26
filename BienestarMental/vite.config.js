import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Esto asegura que los assets se carguen correctamente en S3
  test: { 
    globals: true,
    environment: "jsdom",
    setupFiles: './tests/setup.js', 
  },
});