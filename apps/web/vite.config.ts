import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Load .env from root directory
  envDir: path.resolve(__dirname, "../.."),
  // Only expose API_ and ADMIN_ prefixed variables to frontend
  envPrefix: ['API_', 'ADMIN_'],
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
