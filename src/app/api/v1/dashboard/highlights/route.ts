import connectDB from "@/database";
import { Day } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, getAuthUser } from "@/utils";

/**
 * @route GET /api/v1/dashboard/highlights
 * @description Fetches all daily highlights for a specific month.
 * @param {string} month - The month to fetch highlights for, in "YYYY-MM" format (e.g., "2025-07").
 * @access Private (Requires user to be logged in)
 */
export const GET = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid month format. Please use YYYY-MM");
    }

	const year = parseInt(month.split('-')[0]);
	const monthIndex = parseInt(month.split('-')[1]) - 1;

	// create the start date explicitly in UTC
	const startDate = new Date(Date.UTC(year, monthIndex, 1));

	// create the end date by going to the start of the next month and subtracting one millisecond
	const endDate = new Date(Date.UTC(year, monthIndex + 1, 1));
	endDate.setUTCMilliseconds(-1);

	const highlights = await Day.find({
        user: userId,
        date: {
            $gte: startDate,
            $lte: endDate,
        },
        highlight: { $exists: true, $ne: "" },
    })
    .select('date highlight')
    .sort({ date: 'asc' });

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            { highlights },
            "Highlights fetched successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});