import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { mailSender } from "@/utils/mailSender";
import { COOKIE_OPTIONS, MAIL_TITLES } from "@/constant";
import { recoverAccountEmail } from "@/mails/recover-account.template";
import { generateAccessAndRefreshTokens } from "@/utils/generateAccessAndRefreshTokens";

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const body = await request.json();
	const { token } = body;
	if (!token) {
		throw new APIError(400, "Token is required");
	}

	const user = await User.findOne({ deleteAccountToken: token });
	if (!user) {
		throw new APIError(404, "Account not found");
	}

	const diffDays = (Date.now() - user.deletedAt!.getTime()) / (1000 * 60 * 60 * 24);
	if (diffDays > 30) {
		throw new APIError(410, "Recovery period expired");
	}

	user.isDeleted = false;
	user.deletedAt = null;
	user.deleteAccountToken = null;

	const recoveredUser = await user.save({ validateBeforeSave: false });
	if (!recoveredUser) {
		throw new APIError(500, "Failed to recover account. Try after sometime");
	}

	// send mail to default mail for testing only
	await mailSender({ 
		email: process.env.DEFAULT_MAIL!, 
		title: MAIL_TITLES.recover, 
		body: recoverAccountEmail(user.username, `http://localhost:3000/login`)
	});

	await mailSender({
		email: user.email,
		title: MAIL_TITLES.recover,
		body: recoverAccountEmail(user.username, `http://localhost:3000/login`)
	});

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

	const cookieStore = cookies();
	(await cookieStore).set("accessToken", accessToken, COOKIE_OPTIONS);
	(await cookieStore).set("refreshToken", refreshToken, COOKIE_OPTIONS);

	return NextResponse.json(
		new APIResponse(
			200,
			{},
			"Account Recovered Successfully",
		),
		{ status: 200 }
	);
});