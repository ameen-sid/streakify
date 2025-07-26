import connectDB from "@/database";
import Day from "@/models/day.model";
import Discipline from "@/models/discipline.model";
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

	const discipline = await Discipline.findOne({
		owner: userId,
		status: 'Active'
	})
	.select("name currentStreak longestStreak");
	if(!discipline) {
		throw new APIError(404, "Discipline not found");
	}

	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const end = new Date();
	end.setHours(23, 59, 59, 999);

	const day = await Day.findOne({
		user: userId,
		discipline: discipline._id,
		date: { 
			$gte: start, 
			$lte: end 
		}
	})
	.populate({
		path: "taskState",
		populate: {
			path: "task",
		}
	});
	if(!day) {
		throw new APIError(404, "Day not found");
	}

	const responseData = { discipline, day };
	
	return NextResponse.json(
		new APIResponse(
			200,
			responseData,
			"Today's Log Fetched Successfully",
		),
		{ status: 200 }
	);
});