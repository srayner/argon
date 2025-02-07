import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  env: {
    USER_PASSWORD: process.env.USER_PASSWORD_USER,
    ADMIN_PASSWORD: process.env.USER_PASSWORD_USER,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
