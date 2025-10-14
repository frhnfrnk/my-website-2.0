/**
 * Seed Script Wrapper
 * Loads environment variables before running seed
 */

// Load environment variables FIRST
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

// Now we can safely import and run the seed
import("./seed-data.js")
  .then((module) => {
    module.default();
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
