import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
 
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
 
  resolve: {
    alias: {
      "xlsx": "xlsx-js-style"
    }
  },
 
  server: {
    proxy: {
      "/documents": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})