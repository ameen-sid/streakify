import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { MAIL_TITLES } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { mailSender } from "@/utils/mailSender";
import { generateToken } from "@/utils/generateToken";
import { resetPasswordEmail } from "@/mail/reset-password.template";

connectDB();

export const POST = asyncHandler(async (request: NextRequest) => {
  	
	const body = await request.json();
	const { email } = body;
	if (!email) {
		throw new APIError(400, "Email is required");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new APIError(404, "Email is not registered with us");
	}

	const token = await generateToken(user._id);

	const updatedUser = await User.findByIdAndUpdate(
		user._id, 
		{
			$set: {
				resetPasswordToken: token,
				resetPasswordExpires: Date.now() + 1800000,
			}
		},
		{ new: true },
	);
	if(!updatedUser) {
		throw new APIError(500, "Failed to set reset password token");
	}

	// send mail to default mail for testing only
	await mailSender({
		email: process.env.DEFAULT_MAIL!,
		title: MAIL_TITLES.reset,
		body: resetPasswordEmail(user.username, `http://localhost:3000/reset-password/${updatedUser.resetPasswordToken}`)
	});

	await mailSender({
		email: user.email,
		title: MAIL_TITLES.reset,
		body: resetPasswordEmail(user.username, `http://localhost:3000/reset-password/${updatedUser.resetPasswordToken}`)
	});

	return NextResponse.json(
		new APIResponse(200, {}, "Email Sent Successfully"),
		{ status: 200 },
	);
});