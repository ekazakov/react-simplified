import react from "@vitejs/plugin-react";

export default {
  plugins: [react({
    jsxRuntime: "automatic",
  })],
  // mode: "production",
  server: {
    port: 3000,
    hmr: false,
    open: true
  },
  resolve: {
    alias: {
      "react/jsx-dev-runtime": "./src/jsx-dev-runtime/index.ts",
      "react/jsx-runtime": "./src/jsx-runtime/index.ts",
    }
  }
};
