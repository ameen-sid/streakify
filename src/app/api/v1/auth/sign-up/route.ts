import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { MAIL_TITLES, USER_HIDE_FIELDS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { mailSender } from "@/utils/mailSender";
import { generateToken } from "@/utils/generateToken";
import { verificationEmail } from "@/mails/verification.template";

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
		avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=${fullname[0]}${fullname.split(' ')[1][0]}`,
		gender,
		password
	});

	const createdUser = await User.findById(user._id).select(USER_HIDE_FIELDS);
	if (!createdUser) {
		throw new APIError(500, "Failed to create user");
	}

	const token = await generateToken(createdUser._id);

	user.verifyEmailToken = token;

	const updatedUser = await user.save({ validateBeforeSave: false });
	if(!updatedUser) {
		throw new APIError(500, "Failed to set verify email token");
	}

	// send mail to default mail for testing only
	await mailSender({ 
		email: process.env.DEFAULT_MAIL!, 
		title: MAIL_TITLES.verify, 
		body: verificationEmail(user.username, `http://localhost:3000/verify-email/${updatedUser.verifyEmailToken}`)
	});

	await mailSender({ 
		email, 
		title: MAIL_TITLES.verify, 
		body: verificationEmail(user.username, `http://localhost:3000/verify-email/${updatedUser.verifyEmailToken}`)
	});

	return NextResponse.json(
		new APIResponse(201, createdUser, "User Registered Successfully"),
		{ status: 201 },
	);
});