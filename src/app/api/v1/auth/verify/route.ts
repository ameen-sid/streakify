import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MAIL_TITLES, USER_HIDE_FIELDS, COOKIE_OPTIONS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { mailSender } from "@/utils/mailSender";
import { generateAccessAndRefreshTokens } from "@/utils/generateAccessAndRefreshTokens";
import { welcomeEmail } from "@/mails/welcome.template";

connectDB();

export const POST = asyncHandler(async (request: NextRequest) => {
	
	const body = await request.json();
	const { token } = body;
	if(!token) {
		throw new APIError(400, "Token is required");
	}

	const user = await User.findOne({ verifyEmailToken: token });
	if(!user) {
		throw new APIError(404, "User not found");
	}

	user.isVerified = true;
	user.verifyEmailToken = "";

	const updatedUser = await user.save({ validateBeforeSave: false });
	if(!updatedUser) {
		throw new APIError(500, "Failed to verified user");
	}

	// send mail to default mail for testing only
	await mailSender({
		email: process.env.DEFAULT_MAIL!,
		title: MAIL_TITLES.welcome,
		body: welcomeEmail(user.username, `http://localhost:3000/discipline`)
	});

	await mailSender({
		email: user.email,
		title: MAIL_TITLES.welcome,
		body: welcomeEmail(user.username, `http://localhost:3000/discipline`)
	});

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

	const loggedInUser = await User.findById(user._id).select(USER_HIDE_FIELDS);

	const cookieStore = cookies();
	(await cookieStore).set("accessToken", accessToken, COOKIE_OPTIONS);
	(await cookieStore).set("refreshToken", refreshToken, COOKIE_OPTIONS);

	return NextResponse.json(
		new APIResponse(
			200,
			{
				user: loggedInUser,
				isVerified: user.isVerified,
			},
			"User Verified Successfully"
		),
		{ status: 200 }
	);
});