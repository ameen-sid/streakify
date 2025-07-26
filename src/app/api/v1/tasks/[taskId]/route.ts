import connectDB from "@/database";
import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const DELETE = async (request: NextRequest, { params }: { params: { taskId: string } }) => {
	try {
		
		await connectDB();

		const userId = request.cookies.get("user-id")?.value;
		if(!userId) {
			throw new APIError(401, "Unauthorized: User is not authenticated.");
		}

		const { taskId } = await params;
		if(!taskId) {
			throw new APIError(400, "taskId is not found");
		}

		const result = await Task.deleteOne({ _id: taskId });
		if(result.deletedCount === 0) {
			throw new APIError(404, "Task not found");
		}

		return NextResponse.json(
			new APIResponse(
				200,
				{},
				"Task Deleted Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};

export const GET = async (request: NextRequest, { params }: { params: { taskId: string } }) => {
	try {
		
		await connectDB();

		const userId = request.cookies.get("user-id")?.value;
		if(!userId) {
			throw new APIError(401, "Unauthorized: User is not authenticated.");
		}

		const { taskId } = await params;
		if(!taskId) {
			throw new APIError(400, "taskId is not found");
		}

		const task = await Task.findById(taskId);
		if(!task) {
			throw new APIError(404, "Task not found");
		}

		return NextResponse.json(
			new APIResponse(
				200,
				task,
				"Task Fetched Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};

export const PATCH = async (request: NextRequest, { params }: { params: { taskId: string } }) => {
	try {
		
		await connectDB();

		const userId = request.cookies.get("user-id")?.value;
		if(!userId) {
			throw new APIError(401, "Unauthorized: User is not authenticated.");
		}

		const { taskId } = await params;
		if(!taskId) {
			throw new APIError(400, "taskId is not found");
		}

		const body = await request.json();
		const { name, description, priority } = body;
		if (!name || !description || !priority) {
			throw new APIError(400, "All fields are required");
		}

		const task = await Task.findById(taskId);
		if(!task) {
			throw new APIError(404, "Task not found");
		}

		task.name = name;
		task.description = description;
		task.priority = priority;

		const updatedTask = await task.save({ validateBeforeSave: false });
		if (!updatedTask) {
			throw new APIError(500, "Failed to update task");
		}

		return NextResponse.json(
			new APIResponse(
				200,
				updatedTask,
				"Task Updated Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};