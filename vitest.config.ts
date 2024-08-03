import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true
  },
  resolve: {
    alias: {
      // react: "./src/foo.ts",
      "react/jsx-dev-runtime": "/src/jsx-dev-runtime/index.ts",
      "react/jsx-runtime": "/src/jsx-runtime/index.ts"
      // "react/jsx-runtime": "/src/jsx.ts",
    }
  }
});
