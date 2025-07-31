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

const getPublicIdFromUrl = (url: string): string | null => {

	if(!url || !url.includes('cloudinary.com')) {
		return null;
	}

	try {

		const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
        const match = url.match(regex);

		if (match && match[1])	return match[1];

		return null;
	} catch(error) {

		console.error("Error parsing Cloudinary URL:", error);
        return null;
	}
}

const deleteFromCloudinary = async (publicId: string): Promise<void> => {

	if(!publicId)	return;

	try {

		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: RESOURCE_TYPE
		});

		if(result.result !== 'ok') {
			throw new Error(`Cloudinary deletion failed with result: ${result.result}`);
		}

		console.log(`Successfully deleted asset from Cloudinary: ${publicId}`);
	} catch(error) {

		console.error("Error while deleting from Cloudinary: ", error);
		throw new APIError(500, `Failed to delete asset from cloud service for publicId: ${publicId}`);
	}
}

export { uploadOnCloudinary, getPublicIdFromUrl, deleteFromCloudinary };