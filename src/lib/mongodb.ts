import mongoose from "mongoose";

const MONGO_URI = process.env.MONGOLOQUENT_DATABASE_URI || "";
const MONGO_COLLECTION = process.env.MONGOLOQUENT_DATABASE_NAME || "";
if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI, { dbName: MONGO_COLLECTION });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
export default connectDB;
