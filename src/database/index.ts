import mongoose from "mongoose";
import { DB_NAME } from "@/constant";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined.");
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
		
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
    	
		cached.promise = mongoose.connect(`${MONGODB_URI}/${DB_NAME}`, {
      		bufferCommands: false,
    	}).then((mongooseInstance) => {
      		
			console.log("MongoDB connected");
      		return mongooseInstance;
    	}).catch((error) => {
      		
			console.error("MongoDB connection error:", error);
      		throw error;
    	});
  	}

	cached.conn = await cached.promise;
  	return cached.conn;
}

export default connectDB;