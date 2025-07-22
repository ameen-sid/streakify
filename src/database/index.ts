import mongoose from "mongoose";
import { DB_NAME } from "@/constant";

const connectDB = async () => {
	try {

		if(!process.env.MONGODB_URI) {
			
			console.error("MONGODB_URI environment variable is not defined.");
			process.exit(1);
		}

		mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

		const connection = mongoose.connection;

		connection.on('connected', () => console.log("Database Connected") );

		connection.on('error', (err) => {
			
			console.error("MongoDB connection error: " + err);
			process.exit(1);
		});

		process.on('SIGINT', async () => {
			
			await mongoose.connection.close();
			console.log("MongoDB connection closed due to Node.js process termination");
			process.exit(0);
		});
	} catch(error: unknown) {

		console.error("Error connecting to database: ", error);
		process.exit(1);
	}
}

export default connectDB;