import mongoose from "mongoose";



export async function dbConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing");
  mongoose.set("bufferCommands", false); // optional: fail fast if not connected
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // IMPORTANT: bubble up so server doesn’t start
  }
}
