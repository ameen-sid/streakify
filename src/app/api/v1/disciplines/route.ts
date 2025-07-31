import connectDB from "@/database";
import Discipline from "@/models/discipline.model";
import { NextRequest, NextResponse } from "next/server";
import { DISCIPLINE_STATUS, HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const disciplines = await Discipline.find({ owner: user._id });
	
	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            disciplines,
            "Disciplines fetched successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const body = await request.json();
    const { name, description, startDate, endDate } = body;
    if (!name || !description || !startDate || !endDate) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields are required");
    }

	const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize today to midnight
	const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

	if (start < now) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Start date cannot be in the past.");
    }
    if (end < start) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "End date cannot be before the start date.");
    }

	const existingActiveDiscipline = await Discipline.findOne({
		owner: userId,
		status: DISCIPLINE_STATUS.ACTIVE,
		startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
    });

	if (existingActiveDiscipline) {
        throw new APIError(HTTP_STATUS.CONFLICT, "You already have a discipline that is currently active. Please complete or wait for it to finish before creating a new one.");
    }

	const discipline = await Discipline.create({
        name,
        description,
        startDate: start,
        endDate: end,
        owner: userId,
        status: DISCIPLINE_STATUS.ACTIVE
    });

	if (!discipline) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to create discipline. Please try again.");
    }

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.CREATED,
            discipline,
            "Discipline Created Successfully",
        ),
        { status: HTTP_STATUS.CREATED }
    );
});