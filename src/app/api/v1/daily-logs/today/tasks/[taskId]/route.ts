import mongoose from "mongoose";
import connectDB from "@/database";
import Discipline from "@/models/discipline.model";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const PATCH = asyncHandler(async (request: NextRequest, { params }: { params: { taskId: string } }) => {
	
	await connectDB();

	const session = await mongoose.startSession();
	try {

		session.startTransaction();

		const user = await getAuthUser(request);
        const userId = user._id;

		const { taskId } = await params;
        if (!taskId) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Task ID is required");
        }

		const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

		const result = await Day.updateOne(
			{
				user: userId,
				date: today,
				"taskState.task": taskId,
			},
			{
				$set: { "taskState.$.isCompleted": true },
			},
			{ session }
		);

		if (result.modifiedCount === 0) {
            throw new APIError(HTTP_STATUS.NOT_FOUND, "Failed to update task. It may already be completed or not found for today.");
        }

		// check for streak achievement (75% completion)
		const todayLog = await Day.findOne({
			user: userId,
			date: today,
		})
		.session(session);

		if (!todayLog) {
            throw new APIError(HTTP_STATUS.NOT_FOUND, "Could not find today's log after update.");
        }

		const completedTasks = todayLog.taskState.filter(ts => ts.isCompleted).length;
		const totalTasks = todayLog.taskState.length;
		const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const streakAchieved = completionRate >= 75;

		// if streak threshold isn't met. we're done. commit and return
		if (!streakAchieved) {
         
			await session.commitTransaction();
            return NextResponse.json(
				new APIResponse(
					HTTP_STATUS.OK, 
					{}, 
					"Task marked as completed successfully"
				),
				{ status: HTTP_STATUS.OK }
			);
        }

		// handle streak logic (since threshold was met)
		const discipline = await Discipline.findOne({ 
			owner: userId, 
			_id: todayLog.discipline 
		})
		.session(session);

		if (!discipline) {
         
			await session.commitTransaction();
            return NextResponse.json(
				new APIResponse(
					HTTP_STATUS.OK, 
					{}, 
					"Task marked as completed, but no active discipline found to update streak."
				),
				{ status: HTTP_STATUS.OK }
			);
        }

		const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayLog = await Day.findOne({ 
			user: userId, 
			date: yesterday 
		})
		.session(session);

		let newStreak = 1;
        if (yesterdayLog) {

            const yesterdayCompleted = yesterdayLog.taskState.filter(ts => ts.isCompleted).length;
            const yesterdayTotal = yesterdayLog.taskState.length;
            const yesterdayCompletionRate = yesterdayTotal > 0 ? (yesterdayCompleted / yesterdayTotal) * 100 : 0;
            
            if (yesterdayCompletionRate >= 75) {
                newStreak = discipline.currentStreak + 1;
            }
        }

		discipline.currentStreak = newStreak;
        if (newStreak > discipline.longestStreak) {
            discipline.longestStreak = newStreak;
        }
        await discipline.save({ session });

		await session.commitTransaction();

        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK,
                { currentStreak: discipline.currentStreak },
                "Task marked as completed and streak updated successfully"
            ),
            { status: HTTP_STATUS.OK }
        );
	} catch(error) {

		await session.abortTransaction();
        throw error;
	} finally {
		await session.endSession();
	}
});