import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { uploadOnCloudinary } from "@/utils/uploadOnCloudinary";

export const PATCH = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const formData = await request.formData();
	const file = formData.get('avatar') as File | null;
	if (!file) {
		throw new APIError(400, "Avatar file is required");
	}

	const buffer = Buffer.from(await file.arrayBuffer());

	const avatar = await uploadOnCloudinary(buffer, file.name);
	if (!avatar?.url) {
		throw new APIError(500, "Failed to upload avatar");
	}

	const user = await User.findByIdAndUpdate(
		userId,
		{
			$set: {
				avatar: avatar.url,
			},
		},
		{ new: true },
	)
	.select("avatar");

	if (!user) {
		throw new APIError(500, "Failed to update avatar");
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