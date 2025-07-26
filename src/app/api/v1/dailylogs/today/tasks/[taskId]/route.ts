import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import Discipline from "@/models/discipline.model";

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

		const day = await Day.findOne({
			"user": userId,
			"taskState.task": taskId,
		});
		if (!day) {
			throw new APIError(404, "Day not found");
		}

		const completedBefore = day.taskState.filter(ts => ts.isCompleted).length;

		const result = await Day.updateOne(
			{
				"user": userId,
				"taskState.task": taskId,
			},
			{
				$set: {
					"taskState.$.isCompleted": true,
				},
			}
		);

		if (result.modifiedCount === 0) {
			throw new APIError(500, "Failed to update task");
		}

		if (completedBefore === 0) {

			const discipline = await Discipline.findOne({ _id: day.discipline });
			if (!discipline) {
				throw new APIError(404, "Discipline not found");
			}

			discipline.currentStreak += 1;

			if (discipline.currentStreak > discipline.longestStreak) {
				discipline.longestStreak = discipline.currentStreak;
			}

			const updatedDiscipline = await discipline.save({ validateBeforeSave: false});
			if(!updatedDiscipline) {
				throw new APIError(500, "Failed to update streak in discipline");
			}
		}

		return NextResponse.json(
			new APIResponse(
				200,
				{},
				"Task Mark as Compelted Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};