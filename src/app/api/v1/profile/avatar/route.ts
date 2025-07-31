import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_TYPES, HTTP_STATUS, MAX_SIZE } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { uploadOnCloudinary, getPublicIdFromUrl, deleteFromCloudinary } from "@/utils/cloudinary";
import { sanitizeUser } from "@/utils/sanitizeUser";

export const PATCH = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const formData = await request.formData();
    const file = formData.get('avatar') as File | null;
    if (!file) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Avatar file is required");
    }

	if (!ALLOWED_TYPES.includes(file?.type)) {
		throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid file type. Only JPG, PNG, and WEBP allowed.");
	}

	if (file.size > MAX_SIZE) {
		throw new APIError(HTTP_STATUS.BAD_REQUEST, "File size exceeds 2MB limit");
	}

	const buffer = Buffer.from(await file.arrayBuffer());

    const newAvatar = await uploadOnCloudinary(buffer, file.name);
    if (!newAvatar?.url) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to upload new avatar to cloud service.");
    }

	if (user.avatar) {
        
		const oldPublicId = getPublicIdFromUrl(user.avatar);
        if (oldPublicId) {
            await deleteFromCloudinary(oldPublicId);
        }
    }

	const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: newAvatar.url,
            },
        },
        { new: true },
    );

    if (!updatedUser) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update avatar in the database.");
    }

	const sanitizedUser = sanitizeUser(updatedUser);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            sanitizedUser,
            "Avatar Updated Successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});