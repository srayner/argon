import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  // Uses a server already running on port 3001 as it is. Otherwise seeds,
  // builds and starts a production server, and stops it after the run.
  webServer: {
    command: "npm run seed && npm run build && npm start",
    url: "http://localhost:3001",
    reuseExistingServer: true,
  },
});
