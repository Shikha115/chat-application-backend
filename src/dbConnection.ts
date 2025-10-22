import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}
