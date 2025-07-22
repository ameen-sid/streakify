import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from "fs";

const uploadOnCloudinary = async (
	localFilePath: string
): Promise<UploadApiResponse | null> => {
	try {

		if (!localFilePath) return null;

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
			folder: process.env.CLOUDINARY_FOLDER_NAME,
		});
		console.log("File is uploaded on cloudinary: ", response);

		fs.unlinkSync(localFilePath);

		return response;
	} catch (error) {

		console.error("Error while uploading to cloudinary:", error);
		if(fs.existsSync(localFilePath))	fs.unlinkSync(localFilePath);
		return null;
	}
};

export { uploadOnCloudinary };