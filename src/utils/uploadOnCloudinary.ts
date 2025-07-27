import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import streamifier from "streamifier";
import cloudinaryConnect from "@/config/cloudinary";
import { FOLDER_NAME, RESOURCE_TYPE, HTTP_STATUS } from "@/constant";
import { APIError } from "./APIError";

const uploadOnCloudinary = async (
	fileBuffer: Buffer,
	filename: string
): Promise<{ url: string }> => {

	await cloudinaryConnect();

	const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${filename.split('.')[0]}`;
	
	return new Promise((resolve, reject) => {

		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: process.env.CLOUDINARY_FOLDER_NAME || FOLDER_NAME,
				public_id: uniqueFilename,
				resource_type: RESOURCE_TYPE
			},
			(error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {

				if (error) {
                    
					console.error("Cloudinary upload stream error:", error);
                    return reject(new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to upload file to cloud service."));
                }

				if (!result || !result.secure_url) {
                 
					console.error("Cloudinary upload failed: No result or secure_url returned.");
                    return reject(new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "File upload failed after processing."));
                }

				resolve({ url: result?.secure_url! });
			}
		);

		streamifier.createReadStream(fileBuffer).pipe(uploadStream);
	});
};

export { uploadOnCloudinary };