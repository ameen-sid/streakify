import connectDB from "@/database";
import Discipline from "@/models/discipline.model";
import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	try {
		
		await connectDB();

		const userId = request.cookies.get("user-id")?.value;
		if(!userId) {
			throw new APIError(401, "Unauthorized: User is not authenticated.");
		}

		const { disciplineId } = await params;
		if(!disciplineId) {
			throw new APIError(400, "DisciplineId is not found");
		}

		const discipline = await Discipline.findById(disciplineId);
		if(!discipline) {
			throw new APIError(404, "Discipline not found");
		}

		const tasks = await Task.find({ discipline: disciplineId });
		if (!tasks) {
			throw new APIError(500, "Failed to fetch tasks");
		}

		return NextResponse.json(
			new APIResponse(
				200,
				{
					tasks,
					discipline
				},
				"All Tasks Fetched Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};

export const POST = async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
	try {
		
		await connectDB();

		const userId = request.cookies.get("user-id")?.value;
		if(!userId) {
			throw new APIError(401, "Unauthorized: User is not authenticated.");
		}

		const { disciplineId } = await params;
		if(!disciplineId) {
			throw new APIError(400, "DisciplineId is not found");
		}

		const body = await request.json();
		const { name, description, priority } = body;
		if (!name || !description || !priority) {
			throw new APIError(400, "All fields are required");
		}

		const task = await Task.create({
			name,
			description,
			priority,
			discipline: disciplineId,
		});

		if (!task) {
			throw new APIError(500, "Failed to create task");
		}

		return NextResponse.json(
			new APIResponse(
				201,
				task,
				"Task Created Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};