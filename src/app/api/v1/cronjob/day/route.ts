import connectDB from "@/database";
import Day from "@/models/day.model";
import Discipline from "@/models/discipline.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import Task from "@/models/task.model";

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const userId = request.headers.get("x-user-id");
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}

	const discipline = await Discipline.findOne({ owner: userId });
	if(!discipline) {
		throw new APIError(404, "Discipline not found");
	}

	const tasks = await Task.find({
		// user: userId,
		discipline: discipline._id
	});
	if(tasks.length === 0){
		return NextResponse.json(
			new APIResponse(404, {}, "No Tasks Created In Discipline"),
			{ status: 404 },
		);
	}

	const taskStateData = tasks.map(task => ({
		task: task._id,
		isCompleted: false,
	}));

	const day = await Day.create({
		date: new Date(),
		user: userId,
		discipline: discipline._id,
		taskState: taskStateData
	});
	if(!day) {
		throw new APIError(500, "Failed to create day");
	}
	
	return NextResponse.json(
		new APIResponse(
			200,
			{},
			"Day Created Successfully",
		),
		{ status: 200 }
	);
});