import bcrypt from "bcrypt";
import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const PATCH = asyncHandler(async (request: NextRequest) => {
  	
	await connectDB();

	const body = await request.json();
    const { newPassword, token } = body;
    if (!newPassword?.trim() || !token?.trim()) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "New password and token are required");
    }

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	const user = await User.findOneAndUpdate(
		{
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: new Date() }
		},
		{
			$set: { password: hashedPassword },
			$unset: {
				resetPasswordToken: "",
				resetPasswordExpires: ""
			}
		},
		{ new: false }
	);

	if (!user) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid or expired password reset token. Please try again.");
    }

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            null, 
            "Password has been reset successfully"
        ),
        { status: HTTP_STATUS.OK },
    );
});