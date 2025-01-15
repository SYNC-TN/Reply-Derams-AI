import mongoose from "mongoose";

// Define the cached connection interface
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the global mongoose variable
declare global {
  var mongoose: CachedConnection | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// Initialize the cached connection
const cached: CachedConnection = global.mongoose || {
  conn: null,
  promise: null,
};

// Set the global mongoose object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
