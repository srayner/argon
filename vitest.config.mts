import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [
    // Source has JSX in plain .js files (app/ui/button/button.js, dashboard/layout.js)
    {
      name: "jsx-in-js",
      enforce: "pre",
      transform(code, id) {
        if (!/\.js$/.test(id) || id.includes("node_modules")) return null;
        return transformWithOxc(code, id, { lang: "jsx" });
      },
    },
    react(),
  ],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
    include: ["__tests__/**/*.test.{js,jsx,ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{js,ts,tsx}", "components/**/*.{js,ts,tsx}"],
      reporter: ["text", "lcov"],
    },
  },
});
