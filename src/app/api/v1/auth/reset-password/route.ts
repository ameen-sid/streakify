import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

connectDB();

export const PATCH = asyncHandler(async (request: NextRequest) => {
  	
	const body = await request.json();
	const { newPassword, confirmPassword, token } = body;
	if (!newPassword || !confirmPassword || !token) {
		throw new APIError(400, "All fields are required");
	}

	if (newPassword !== confirmPassword) {
		throw new APIError(400, "Password and Confirm password are not equal");
	}

	const user = await User.findOne({ resetPasswordToken: token });
	if (!user) {
		throw new APIError(400, "Invalid Token");
	}

	if (user.resetPasswordExpires!.getTime() < Date.now()) {
		throw new APIError(401, "Token has expired. Please request a new one.");
	}

	user.password = newPassword;
	user.resetPasswordToken = "";
	user.resetPasswordExpires = null;

	const updatedUser = await user.save({ validateBeforeSave: false });
	if (!updatedUser) {
		throw new APIError(500, "Failed to reset password");
	}

	return NextResponse.json(
		new APIResponse(200, {}, "Password Reset Successfully"),
		{ status: 200 },
	);
});