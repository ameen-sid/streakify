import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { sanitizeUser } from "@/utils/sanitizeUser";

export const GET = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const sanitizedUser = sanitizeUser(user);

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            sanitizedUser,
            "User profile fetched successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});

export const PATCH = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const body = await request.json();
    const { fullname, dateOfBirth, gender } = body;
    if (!fullname?.trim() || !dateOfBirth?.trim() || !gender?.trim()) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Full name, date of birth, and gender are required");
    }

	const updatedUser = await User.findByIdAndUpdate(
		userId,
		{
			$set: {
				fullname,
				dateOfBirth,
				gender,
			}
		},
		{
			new: true,
			runValidators: true
		}
	);

	if (!updatedUser) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update user profile");
    }

	const sanitizedUser = sanitizeUser(updatedUser);

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            sanitizedUser,
            "User profile updated successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});