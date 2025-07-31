import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS, HTTP_STATUS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { generateAccessAndRefreshTokens } from "@/utils/generateAccessAndRefreshTokens";
import { sanitizeUser } from "@/utils/sanitizeUser";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();
  	
	const body = await request.json();
	const { email, password } = body;
	if (!email || !password) {
		throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields are required");
	}

	const user = await User.findOne({ email });

	if(!user || !(await user.isPasswordCorrect(password))) {
		throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Invalid user credentials");
	}

	if(!user.isVerified) {
		throw new APIError(HTTP_STATUS.FORBIDDEN, "Account is not verified. Please verify your email to log in.");
	}
	if (user.isDeleted) {
		throw new APIError(HTTP_STATUS.FORBIDDEN, "Account is scheduled for deletion. Please recover it from your email.");
	}
	if (user.isDeactivated) {
		throw new APIError(HTTP_STATUS.FORBIDDEN, "This account has been permanently deactivated. Please contact support.");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

	const sanitizedUser = sanitizeUser(user);

	const cookieStore = await cookies();
	cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS);
	cookieStore.set("refreshToken", refreshToken, COOKIE_OPTIONS);
	
	return NextResponse.json(
		new APIResponse(
			HTTP_STATUS.OK,
			{
				user: sanitizedUser,
				accessToken,
				refreshToken,
			},
			"User Logged In Successfully",
		),
		{ status: HTTP_STATUS.OK }
	);
});