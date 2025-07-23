import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { MAIL_TYPES, USER_HIDE_FIELDS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { mailSender } from "@/utils/mailSender";

connectDB();

export const POST = asyncHandler(async (request: NextRequest) => {
	
	const body = await request.json();
	const { username, email, fullname, gender, password, confirmPassword } = body;
	if (!username || !email || !fullname || !gender || !password || !confirmPassword) {
		throw new APIError(400, "All fields are required");
	}

	if (password !== confirmPassword) {
		throw new APIError(400, "Password and confirm password should be same");
	}

	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});
	if (existedUser) {
		throw new APIError(409, "User with this email or username already exists");
	}

	const user = await User.create({
		username: username.toLowerCase(),
		email,
		fullname,
		avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
		gender,
		password
	});

	const createdUser = await User.findById(user._id).select(USER_HIDE_FIELDS);
	if (!createdUser) {
		throw new APIError(500, "Failed to create user");
	}

	await mailSender({ 
		email, 
		emailType: MAIL_TYPES.verify, 
		body: "", 
		userId: user._id,
	});

	return NextResponse.json(
		new APIResponse(201, createdUser, "User Registered Successfully")
	);
});