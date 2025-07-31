import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { MODEL_NAMES, HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { date: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const { date } = params;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid date format. Please use YYY-MM-DD.");
    }

	const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

	const dayLog = await Day.findOne({
        user: userId,
        date: targetDate,
    })
	.populate({
        path: 'taskState.task',
        model: MODEL_NAMES.TASK,
        select: '_id name description priority'
    });

	if (!dayLog) {
        return NextResponse.json(
            new APIResponse(
				HTTP_STATUS.OK, 
				null, 
				"No log found for the selected date."
			),
			{ status: HTTP_STATUS.OK }
        );
    }

	return NextResponse.json(
        new APIResponse(
			HTTP_STATUS.OK, 
			dayLog, 
			"Log fetched successfully"
		),
        { status: HTTP_STATUS.OK }
    );
});