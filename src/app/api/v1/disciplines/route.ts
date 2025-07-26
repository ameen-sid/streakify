import connectDB from "@/database";
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

	const discipline = await Discipline.find({ owner: userId });
	if (discipline.length === 0) {
		throw new APIError(404, "Disciplines not found");
	}

	return NextResponse.json(
		new APIResponse(
			200,
			discipline,
			"Disciplines Fetched Successfully",
		),
		{ status: 200 }
	);
});

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const body = await request.json();
	const { name, description, startDate, endDate } = body;
	if (!name || !description || !startDate || !endDate) {
		throw new APIError(400, "All fields are required");
	}

	const now = new Date();
	const start = new Date(startDate);
	const end = new Date(endDate);

	if(start < new Date(now.toDateString())) {
		throw new APIError(400, "Start date cannot be in the past. Please select today or a future date.");
	}

	if(end < start) {
		throw new APIError(400, "End date cannot be before start date");
	}

	const activeDiscipline = await Discipline.findOne({ 
    	owner: userId,
    	status: "Active",
	});
	if (activeDiscipline) {
		throw new APIError(409, "User already has an active discipline. Only one active discipline is allowed.");
	}

	const discipline = await Discipline.create({
		name,
		description,
		startDate: start,
		endDate: end,
		owner: userId
	});
	if (!discipline) {
		throw new APIError(500, "Failed to create discipline. Try after sometime");
	}

	return NextResponse.json(
		new APIResponse(
			201,
			discipline,
			"Disciplines Created Successfully",
		),
		{ status: 201 }
	);
});