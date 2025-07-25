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

	const user = await User.findById(userId).select("fullname dateOfBirth gender");
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