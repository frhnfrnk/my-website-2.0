/**
 * MongoDB Connection Singleton
 * Ensures only one connection is created across hot-reloads in development
 */

import mongoose from "mongoose";

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global to include mongoose cache
declare global {
  var mongoose: CachedConnection | undefined;
}

// Cache connection to prevent multiple connections in development hot-reload
const cached: CachedConnection = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB Atlas
 * Returns cached connection if exists
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Check for MONGODB_URI at runtime (not at import time)
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = process.env.MONGODB_DB || "portfolio";

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB (useful for cleanup in tests)
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("❌ MongoDB Disconnected");
  }
}
