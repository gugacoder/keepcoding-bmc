import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3111",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx next dev -p 3111",
    port: 3111,
    reuseExistingServer: false,
    timeout: 30000,
  },
});
