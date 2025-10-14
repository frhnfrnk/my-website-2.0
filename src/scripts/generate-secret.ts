/**
 * Helper: Generate NextAuth Secret
 * Run: tsx src/scripts/generate-secret.ts
 */

import { randomBytes } from "crypto";

const secret = randomBytes(32).toString("base64");

console.log("\n🔐 Generated NEXTAUTH_SECRET:");
console.log("================================");
console.log(secret);
console.log("================================\n");
console.log("Copy this to your .env.local file:");
console.log(`NEXTAUTH_SECRET=${secret}\n`);
