import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const body = await request.json();
    const { highlight } = body;
    if (!highlight) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Highlight text is required");
    }

	const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

	const updatedDay = await Day.findOneAndUpdate(
		{
			user: userId,
			date: today,
		},
		{
			$set: {
				highlight: highlight,
				user: userId,
				date: today,
			}
		},
		{
			new: true,
			upsert: true,	// create document if it doesn't exist
			runValidators: true
		}
	);

	if (!updatedDay) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to save the highlight. Please try again.");
    }

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            { highlight: updatedDay.highlight },
            "Highlight saved successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});