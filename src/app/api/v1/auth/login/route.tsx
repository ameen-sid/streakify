import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS, USER_HIDE_FIELDS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { generateAccessAndRefreshTokens } from "@/utils/generateAccessAndRefreshTokens";

connectDB();

export const POST = asyncHandler(async (request: NextRequest) => {
  	
	const body = await request.json();
	const { email, password } = body;
	if (!email || !password) {
		throw new APIError(400, "All fields are required");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new APIError(404, "User is not registered");
	}

	const isValidPassword = await user.isPasswordCorrect(password);
	if (!isValidPassword) {
		throw new APIError(401, "Password is incorrect");
	}

	if (user.isDeleted) {
		throw new APIError(403, "Account is deleted. recover from email");
	}

	if (user.isDeactivated) {
		throw new APIError(403, "Account permanently deactivated, contact support.");
	}

	if(!user.isVerified) {
		throw new APIError(403, "Account is not verified. First verify account then login");
	}

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
				accessToken,
				refreshToken,
			},
			"User Logged In Successfully",
		),
		{ status: 200 }
	);
});