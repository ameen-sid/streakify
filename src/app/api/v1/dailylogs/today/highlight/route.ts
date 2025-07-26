import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const body = await request.json();
	const { highlight } = body;
	if(!highlight) {
		throw new APIError(400, "Highlight is required");
	}

	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const end = new Date();
	end.setHours(23, 59, 59, 999);

	const day = await Day.findOne({
		user: userId,
		date: { 
			$gte: start, 
			$lte: end 
		}
	});
	if(!day) {
		throw new APIError(404, "Day not found");
	}

	day.highlight = highlight;

	const updatedDay = await day.save({ validateBeforeSave: false });
	if(!updatedDay) {
		throw new APIError(500, "Failed to add highlight");
	}
	
	return NextResponse.json(
		new APIResponse(
			200,
			{},
			"Highlight Added Successfully",
		),
		{ status: 200 }
	);
});