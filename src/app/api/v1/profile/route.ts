import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const user = await User.findById(userId).select("username fullname avatar");
	if(!user) {
		throw new APIError(404, "User not found");
	}

	return NextResponse.json(
		new APIResponse(
			200,
			user,
			"User Fetched Successfully",
		),
		{ status: 200 }
	);
});

export const PATCH = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const body = await request.json();
	const { fullname, dateOfBirth, gender } = body;
	if (!fullname || !dateOfBirth || !gender) {
		throw new APIError(400, "All fields are required");
	}

	const user = await User.findById(userId);
	if(!user) {
		throw new APIError(404, "User not found");
	}

	user.fullname = fullname;
	user.dateOfBirth = dateOfBirth;
	user.gender = gender;

	const updatedUser = await user.save({ validateBeforeSave: false });
	if (!updatedUser) {
		throw new APIError(500, "Failed to update profile");
	}

	return NextResponse.json(
		new APIResponse(
			200,
			{
				fullname: updatedUser.fullname,
				dateOfBirth: updatedUser.dateOfBirth,
				gender: updatedUser.gender
			},
			"User Updated Successfully",
		),
		{ status: 200 }
	);
});