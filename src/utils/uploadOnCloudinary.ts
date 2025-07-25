import cloudinaryConnect from '@/config/cloudinary';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from "streamifier";

const uploadOnCloudinary = async (
	fileBuffer: Buffer,
	filename: string
): Promise<{ url: string }> => {

	await cloudinaryConnect();
	
	return new Promise((resolve, reject) => {

		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: process.env.CLOUDINARY_FOLDER_NAME,
				public_id: filename.split('.')[0],
			},
			(error, result) => {

				if(error)	return reject(error);
				resolve({ url: result?.secure_url! });
			}
		);

		streamifier.createReadStream(fileBuffer).pipe(uploadStream);
	});
};

export { uploadOnCloudinary };