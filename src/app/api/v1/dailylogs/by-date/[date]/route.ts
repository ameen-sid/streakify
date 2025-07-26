import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const GET = async (request: NextRequest, { params }: { params: { date: string } }) => {
	try {
		
		await connectDB();

		const userId = request.cookies.get("user-id")?.value;
		if(!userId) {
			throw new APIError(401, "Unauthorized: User is not authenticated.");
		}

		const { date } = await params;
		if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			throw new APIError(400, "Invalid date format. Please use YYYY-MM-DD.");
		}

		const start = new Date(date);
		start.setHours(0, 0, 0, 0);
		const end = new Date(date);
		end.setHours(23, 59, 59, 999);

		const dayLog = await Day.findOne({
			user: userId,
			date: { 
				$gte: start, 
				$lte: end 
			}
		}).populate({
			path: 'taskState.task',
			model: 'Task',
			select: 'name description priority'
		});

		if(!dayLog) {
			return NextResponse.json(
				new APIResponse(
					200,
					null,
					"No log found for the selected date"
				),
				{ status: 200 }
			);
		}

		return NextResponse.json(
			new APIResponse(
				200,
				dayLog,
				"Log Fetched Successfully",
			),
			{ status: 200 }
		);
	} catch(error) {

		if (error instanceof APIError) throw error;
		else throw new APIError(500, "Internal Server Error");
	}
};