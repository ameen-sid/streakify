import { v2 as cloudinary } from "cloudinary";

const cloudinaryConnect = async () => {
	try {

		if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
			throw new Error("Environment variables are not defined in cloudinary config.");
		}

		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		});

		console.log("Connected to Cloudinary Successfully");
	} catch(error) {
		
		console.error("Error in connecting to cloudinary: ", error);
		throw error;
	}
};

export default cloudinaryConnect;