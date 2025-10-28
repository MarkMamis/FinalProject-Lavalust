import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      // Proxy API calls to your LavaLust PHP backend during development
      '/api': {
        target: 'http://localhost:3000', // change to include port if Apache/XAMPP uses one (e.g. 'http://localhost:8080')
        changeOrigin: true,
        secure: false,
        // preserve cookie domain so PHP session cookies work when proxied
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build into the LavaLust public folder so production deploy is simple.
  build: {
    outDir: path.resolve(__dirname, "../LavaLust-4.2.1/public/frontend"),
    emptyOutDir: false,
    // If you will serve the SPA from a subpath (e.g. /frontend/) uncomment and set base below
    // base: '/frontend/',
  },
}));
