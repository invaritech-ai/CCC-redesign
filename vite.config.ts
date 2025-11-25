import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunk splitting
          if (id.includes("node_modules")) {
            // Sanity libraries
            if (id.includes("@sanity/client") || id.includes("@sanity/image-url")) {
              return "sanity-vendor";
            }

            // Radix UI components - all UI primitives
            if (id.includes("@radix-ui")) {
              return "ui-vendor";
            }

            // Form libraries
            if (
              id.includes("react-hook-form") ||
              id.includes("@hookform/resolvers") ||
              id.includes("/zod/")
            ) {
              return "form-vendor";
            }

            // Query library
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }

            // Utility libraries
            if (
              id.includes("/date-fns/") ||
              id.includes("/lucide-react/") ||
              id.includes("/react-icons/")
            ) {
              return "utils-vendor";
            }

            // Carousel library
            if (id.includes("embla-carousel")) {
              return "carousel-vendor";
            }

            // Chart library
            if (id.includes("/recharts/")) {
              return "chart-vendor";
            }

            // Other large vendor libraries
            if (
              id.includes("/sonner/") ||
              id.includes("/cmdk/") ||
              id.includes("/vaul/") ||
              id.includes("react-day-picker") ||
              id.includes("react-resizable-panels")
            ) {
              return "misc-vendor";
            }

            // React core libraries - match exact package paths
            if (
              id.match(/node_modules\/react(\/|$)/) ||
              id.match(/node_modules\/react-dom(\/|$)/) ||
              id.match(/node_modules\/react-router-dom(\/|$)/)
            ) {
              return "react-vendor";
            }

            // Default vendor chunk for other node_modules
            return "vendor";
          }
        },
      },
    },
    // Optimize build output
    minify: "esbuild",
    cssMinify: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional, can disable for smaller builds)
    sourcemap: false,
  },
}));
