import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, getAuthUser } from "@/utils";

export const PATCH = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const body = await request.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword?.trim() || !newPassword?.trim()) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Current password and new password are required");
    }

	const userWithPassword = await User.findById(userId);
    if (!userWithPassword) {
        throw new APIError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

	const isPasswordCorrect = await userWithPassword.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "The current password you entered is incorrect.");
    }

	userWithPassword.password = newPassword;

    const updatedUser = await userWithPassword.save();
	if(!updatedUser) {
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update password");
	}

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            null, 
            "Password updated successfully"
        ),
        { status: HTTP_STATUS.OK }
    );
});