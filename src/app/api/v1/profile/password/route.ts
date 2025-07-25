import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const PATCH = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const body = await request.json();
	const { currentPassword, newPassword, confirmPassword } = body;
	if (!currentPassword || !newPassword || !confirmPassword) {
		throw new APIError(400, "All fields are required");
	}

	if (newPassword !== confirmPassword) {
		throw new APIError(400, "New password and confirm new password should be same");
	}

	const user = await User.findById(userId);
	if (!user) {
		throw new APIError(404, "User not found");
	}

	const isValidPassword = await user.isPasswordCorrect(currentPassword);
	if (!isValidPassword) {
		throw new APIError(401, "Current password is wrong");
	}

	user.password = newPassword;

	const updatedUser = await user.save({ validateBeforeSave: false });
	if (!updatedUser) {
		throw new APIError(500, "Failed to update password");
	}

	return NextResponse.json(
		new APIResponse(
			200,
			{},
			"Password Updated Successfully",
		),
		{ status: 200 }
	);
});