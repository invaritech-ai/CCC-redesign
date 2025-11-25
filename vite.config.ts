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
        // Ensure proper chunk ordering - react-vendor must load first
        chunkFileNames: (chunkInfo) => {
          // Ensure react-vendor is loaded first by naming convention
          if (chunkInfo.name === "react-vendor") {
            return "assets/react-vendor-[hash].js";
          }
          return "assets/[name]-[hash].js";
        },
        manualChunks(id) {
          // Vendor chunk splitting
          if (id.includes("node_modules")) {
            // React core libraries - MUST be checked FIRST to ensure proper loading order
            if (
              id.match(/node_modules\/react(\/|$)/) ||
              id.match(/node_modules\/react-dom(\/|$)/) ||
              id.match(/node_modules\/react-router-dom(\/|$)/)
            ) {
              return "react-vendor";
            }

            // IMPORTANT: Check for ANY React-dependent packages BEFORE putting in vendor
            // This prevents React-dependent code from loading before React
            if (
              id.includes("react") ||
              id.includes("@radix-ui") ||
              id.includes("@tanstack/react-query") ||
              id.includes("react-hook-form") ||
              id.includes("react-icons") ||
              id.includes("lucide-react") ||
              id.includes("embla-carousel-react") ||
              id.includes("recharts") ||
              id.includes("sonner") ||
              id.includes("cmdk") ||
              id.includes("vaul") ||
              id.includes("react-day-picker") ||
              id.includes("react-resizable-panels") ||
              id.includes("next-themes")
            ) {
              // Categorize React-dependent libraries
              if (id.includes("@radix-ui")) {
                return "ui-vendor";
              }
              if (
                id.includes("react-hook-form") ||
                id.includes("@hookform/resolvers") ||
                id.includes("/zod/")
              ) {
                return "form-vendor";
              }
              if (id.includes("@tanstack/react-query")) {
                return "query-vendor";
              }
              if (id.includes("/lucide-react/") || id.includes("/react-icons/")) {
                return "utils-vendor";
              }
              if (id.includes("embla-carousel-react")) {
                return "carousel-vendor";
              }
              if (id.includes("/recharts/")) {
                return "chart-vendor";
              }
              if (
                id.includes("/sonner/") ||
                id.includes("/cmdk/") ||
                id.includes("/vaul/") ||
                id.includes("react-day-picker") ||
                id.includes("react-resizable-panels") ||
                id.includes("next-themes")
              ) {
                return "misc-vendor";
              }
              // If it has "react" but doesn't match above, put in react-vendor to be safe
              if (id.includes("react")) {
                return "react-vendor";
              }
            }

            // Non-React utility libraries (safe to put in vendor)
            if (id.includes("/date-fns/")) {
              return "utils-vendor";
            }

            // Sanity libraries (server-side, no React dependency)
            if (id.includes("@sanity/client") || id.includes("@sanity/image-url")) {
              return "sanity-vendor";
            }

            // Only put truly non-React dependencies in vendor chunk
            // These are utility libraries that don't depend on React
            if (
              id.includes("/clsx/") ||
              id.includes("/tailwind-merge/") ||
              id.includes("/class-variance-authority/") ||
              id.includes("/dotenv/") ||
              id.includes("/googleapis/") ||
              id.includes("/input-otp/") ||
              id.includes("/tailwindcss-animate/")
            ) {
              return "vendor";
            }

            // For any other unknown packages, let Vite's default chunking handle it
            // This ensures proper dependency resolution and loading order
            return undefined;
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
