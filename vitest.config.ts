import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Run tests in a simulated browser environment
    environment: "jsdom",
    // Make vitest globals (like `describe`, `it`, `expect`) available
    // in all test files without needing to import them.
    globals: true,
    // Path to your setup file
    setupFiles: "./vitest.setup.ts",
    exclude: ["e2e", "node_modules"],
  },
});
