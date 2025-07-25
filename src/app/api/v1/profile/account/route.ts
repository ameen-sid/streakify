import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { mailSender } from "@/utils/mailSender";
import { MAIL_TITLES } from "@/constant";
import { deleteAccountEmail } from "@/mails/delete-account.template";
import { generateToken } from "@/utils/generateToken";

export const DELETE = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const user = await User.findById(userId);
	if(!user) {
		throw new APIError(404, "User not found");
	}

	if (user.isDeleted && user.deletedAt) {
		return NextResponse.json(
			new APIResponse(
				200,
				{},
				"Your Account is Already Scheduled for Deletion.",
			),
			{ status: 200 },
		);
	}

	const token = await generateToken(user._id);

	user.isDeleted = true;
	user.deletedAt = new Date();
	user.deleteAccountToken = token;

	const updatedUser = await user.save({ validateBeforeSave: false });
	if (!updatedUser) {
		throw new APIError(500, "Failed to delete account");
	}

	// send mail to default mail for testing only
	await mailSender({ 
		email: process.env.DEFAULT_MAIL!, 
		title: MAIL_TITLES.delete, 
		body: deleteAccountEmail(updatedUser.username, `http://localhost:3000/recover-account/${updatedUser.deleteAccountToken}`)
	});

	await mailSender({
		email: user.email,
		title: MAIL_TITLES.delete,
		body: deleteAccountEmail(updatedUser.username, `http://localhost:3000/recover-account/${updatedUser.deleteAccountToken}`)
	});

	const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("user-id");
    cookieStore.delete("user-avatar");

	return NextResponse.json(
		new APIResponse(
			202,
			{},
			"User's Account is Scheduled for Deletion in 30 days",
		),
		{ status: 202 }
	);
});