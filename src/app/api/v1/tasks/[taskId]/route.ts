import connectDB from "@/database";
import Task from "@/models/task.model";
import { IDiscipline } from "@/models/discipline.types";
import { ITask } from "@/models/task.types" ;
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

interface IPopulatedTask extends Omit<ITask, 'discipline'> {
	discipline: IDiscipline;
};

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { taskId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const { taskId } = params;
    if (!taskId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Task ID is required");
    }

	const task = await Task.findById(taskId)
	.populate<IPopulatedTask>({
		path: 'discipline',
		select: 'owner'
	});

	if (!task || !task.discipline.owner.equals(user._id)) {
        throw new APIError(HTTP_STATUS.NOT_FOUND, "Task not found or you do not have permission to view it.");
    }

	return NextResponse.json(
        new APIResponse(
			HTTP_STATUS.OK, 
			task, 
			"Task fetched successfully"
		),
        { status: HTTP_STATUS.OK }
    );
});

export const PATCH = asyncHandler(async (request: NextRequest, { params }: { params: { taskId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const { taskId } = params;
    if (!taskId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Task ID is required");
    }

	const body = await request.json();
    const { name, description, priority } = body;
    if (!name || !description || !priority) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields are required");
    }
	
	const taskToUpdate = await Task.findById(taskId)
	.populate<IPopulatedTask>({
		path: 'discipline',
		select: 'owner'
	});

	if(!taskToUpdate || !taskToUpdate.discipline.owner.equals(user._id)) {
	    throw new APIError(HTTP_STATUS.NOT_FOUND, "Task not found or you do not have permission to edit it.");
	}

	const updatedTask = await Task.findByIdAndUpdate(
		taskId,
		{
			$set: {
				name,
				description,
				priority
			}
		},
		{ new: true, runValidators: true }
	);

	if (!updatedTask) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update the task.");
    }

	return NextResponse.json(
        new APIResponse(
			HTTP_STATUS.OK, 
			updatedTask, 
			"Task updated successfully"
		),
        { status: HTTP_STATUS.OK }
    );
});

export const DELETE = asyncHandler(async (request: NextRequest, { params }: { params: { taskId: string } }) => {
	
	await connectDB();

	const user = await getAuthUser(request);

	const { taskId } = params;
    if (!taskId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Task ID is required");
    }

	const taskToDelete = await Task.findById(taskId)
	.populate<IPopulatedTask>({ 
		path: 'discipline', 
		select: 'owner' 
	});

    if (!taskToDelete || !taskToDelete.discipline.owner.equals(user._id)) {
        throw new APIError(HTTP_STATUS.NOT_FOUND, "Task not found or you do not have permission to delete it.");
    }

	const updatedTask = await Task.findByIdAndDelete(taskId);
	if(!updatedTask) {
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to delete task");
	}

	return NextResponse.json(
        new APIResponse(
			HTTP_STATUS.OK, 
			{}, 
			"Task deleted successfully"
		),
        { status: HTTP_STATUS.OK }
    );
});