import connectDB from "@/database";
import Discipline from "@/models/discipline.model";
import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const { disciplineId } = params;
    if (!disciplineId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Discipline ID is required");
    }

	const discipline = await Discipline.findOne({ 
		_id: disciplineId, 
		owner: user._id 
	})
	.select("_id name");

    if (!discipline) {
        throw new APIError(HTTP_STATUS.NOT_FOUND, "Discipline not found or you do not have permission to view it.");
    }

	const tasks = await Task.find({ discipline: disciplineId });
	
	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            {
                tasks,
                discipline
            },
            "Tasks fetched successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});

export const POST = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const { disciplineId } = params;
    if (!disciplineId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Discipline ID is required");
    }

	const discipline = await Discipline.findOne({ 
		_id: disciplineId, 
		owner: user._id 
	});

    if (!discipline) {
        throw new APIError(HTTP_STATUS.NOT_FOUND, "Discipline not found or you do not have permission to add tasks to it.");
    }

	const body = await request.json();
    const { name, description, priority } = body;
    if (!name || !description || !priority) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields (name, description, priority) are required");
    }

	const task = await Task.create({
        name,
        description,
        priority,
        discipline: disciplineId,
    });

	if (!task) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to create task. Please try again.");
    }

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.CREATED,
            task,
            "Task created successfully",
        ),
        { status: HTTP_STATUS.CREATED }
    );
});