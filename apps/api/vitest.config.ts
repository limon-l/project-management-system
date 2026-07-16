import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    passWithNoTests: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
