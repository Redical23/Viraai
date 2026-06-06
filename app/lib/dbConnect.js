import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    // Don't throw at module import time; allow build to complete.
    // Throwing here will surface at runtime when a DB connection is attempted.
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cached.conn) {
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    } else {
      cached.conn = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Connected to MongoDB");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
