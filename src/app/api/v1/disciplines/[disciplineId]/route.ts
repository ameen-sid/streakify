import connectDB from "@/database";
// import mongoose from "mongoose";
import Discipline from "@/models/discipline.model";
import Task from "@/models/task.model";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const DELETE = async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
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

		// const session = await mongoose.startSession();
		// session.startTransaction();
		// try {

		const discipline = await Discipline.findById(disciplineId);
		// .session(session);
		if (!discipline) {

			// await session.abortTransaction();
			// session.endSession();
			throw new APIError(404, "Discipline not found");
		}

		const taskResult = await Task.deleteMany({ discipline: discipline._id });
		// .session(session);

		const disciplineResult = await Discipline.deleteOne({
			_id: discipline._id,
			owner: userId
		});
		// .session(session);

		if (disciplineResult.deletedCount === 0) {

			// await session.abortTransaction();
			// session.endSession();
			throw new APIError(500, "Failed to delete discipline within transasion. Possible concurrent modification or internal error.");
		}

		// await session.commitTransaction();
		// session.endSession();

		return NextResponse.json(
			new APIResponse(
				200,
				{},
				"Disciplines Deleted Successfully",
			),
			{ status: 200 }
		);
	// } catch(error) {

		// await session.abortTransaction();
		// session.endSession();
		// console.error("Transasion aborted due to error: ", error);

		// if (error instanceof APIError) throw error;
		// else throw new APIError(500, "Internal Server Error");
	// }
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};

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
		if (!discipline) {
			throw new APIError(404, "Discipline not found");
		}

		return NextResponse.json(
			new APIResponse(
				200,
				discipline,
				"Disciplines Fetched Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};

export const PATCH = async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {
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
		const { name, description, startDate, endDate } = body;
		if (!name || !description || !startDate || !endDate) {
			throw new APIError(400, "All fields are required");
		}

		const discipline = await Discipline.findById(disciplineId);
		if (!discipline) {
			throw new APIError(404, "Discipline not found");
		}

		discipline.name = name;
		discipline.description = description;
		discipline.startDate = startDate;
		discipline.endDate = endDate;

		const updatedDiscipline = await discipline.save({ validateBeforeSave: false });
		if (!updatedDiscipline) {
			throw new APIError(500, "Failed to update discipline");
		}

		return NextResponse.json(
			new APIResponse(
				200,
				updatedDiscipline,
				"Disciplines Updated Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};