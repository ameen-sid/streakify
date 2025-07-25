import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

/**
 * @route GET /api/v1/dashboard/highlights
 * @description Fetches all daily highlights for a specific month.
 * @param {string} month - The month to fetch highlights for, in "YYYY-MM" format (e.g., "2025-07").
 * @access Private (Requires user to be logged in)
 */
export const GET = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	// 1. get user and validate input
	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const userAvatar = request.cookies.get("user-avatar")?.value;

	const { searchParams } = new URL(request.url);
	const month = searchParams.get("month");
	if(!month || !/^\d{4}-\d{2}$/.test(month)) {
		throw new APIError(400, "Invalid month format. Please use YYYY-MM");
	}

	// 2. prepare the database query
	const year = parseInt(month.split('-')[0]);
	const monthIndex = parseInt(month.split('-')[1]) - 1;
	const startDate = new Date(year, monthIndex, 1);
	const endDate = new Date(year, monthIndex + 1, 0);

	// 3. fetch highlights from the database
	const highlights = await Day.find({
		user: userId,
		date: {
			$gte: startDate,
			$lte: endDate,
		},
		highlight: { $ne: "" },
	})
	.select('date highlight')
	.sort({ date: 'asc' });

	// 4. send the response
	return NextResponse.json(
		new APIResponse(
			200,
			{
				highlights,
				userAvatar
			},
			"Highlights Fetched Successfully",
		),
		{ status: 200 }
	);
});