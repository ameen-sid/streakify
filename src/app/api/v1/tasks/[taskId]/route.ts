import mongoose from "mongoose";
import connectDB from "@/database";
import { Discipline, Task, Day } from "@/models";
import { IDiscipline, ITask } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, getAuthUser } from "@/utils";

interface IPopulatedTask extends Omit<ITask, 'discipline'> {
	discipline: IDiscipline;
};

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { taskId: string } }) => {

	await connectDB();

	const user = await getAuthUser(request);

	const { taskId } = await params;
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

	const { taskId } = await params;
    if (!taskId) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Task ID is required");
    }

	const body = await request.json();
    const { name, description, priority } = body;
    if (!name?.trim() || !description?.trim() || !priority) {
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

	const session = await mongoose.startSession();
    try {

		session.startTransaction();

        const user = await getAuthUser(request);

        const { taskId } = params;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid Task ID format");
		}

        const taskToDelete = await Task.findById(taskId).session(session);
        if (!taskToDelete) {
            throw new APIError(HTTP_STATUS.NOT_FOUND, "Task not found.");
        }

        const discipline = await Discipline.findOne({ 
			_id: taskToDelete.discipline, 
			owner: user._id 
		})
		.session(session);

        if (!discipline) {
            throw new APIError(HTTP_STATUS.FORBIDDEN, "You do not have permission to delete this task.");
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const todayLog = await Day.findOne({ 
			user: user._id, 
			date: today 
		})
		.session(session);

        let wasTodayAStreakDay = false;
        if (todayLog) {

            const completedCount = todayLog.taskState.filter(ts => ts.isCompleted).length;
            const totalCount = todayLog.taskState.length;
            const rateBefore = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            if (rateBefore >= 75) {
                wasTodayAStreakDay = true;
            }
        }

        await Day.updateMany(
            { "taskState.task": taskId },
            { 
				$pull: { taskState: { task: taskId } } 
			},
            { session }
        );

        await Task.findByIdAndDelete(taskId, { session });

        const logAfterDelete = await Day.findOne({ 
            user: user._id, 
            date: today 
        })
        .session(session);

        let isTodayAStreakDay = false;
        if (logAfterDelete && logAfterDelete.taskState.length > 0) {

            const completedCountAfter = logAfterDelete.taskState.filter(ts => ts.isCompleted).length;
            const totalCountAfter = logAfterDelete.taskState.length;
            const rateAfter = (completedCountAfter / totalCountAfter) * 100;
            if (rateAfter >= 75) {
                isTodayAStreakDay = true;
            }
        }

        if (wasTodayAStreakDay && !isTodayAStreakDay) {

            discipline.currentStreak -= 1;
            await discipline.save({ session });
        } else if (!wasTodayAStreakDay && isTodayAStreakDay) {

            discipline.currentStreak += 1;
            if (discipline.currentStreak > discipline.longestStreak) {
                discipline.longestStreak = discipline.currentStreak;
            }
            await discipline.save({ session });
        }

        await session.commitTransaction();

        return NextResponse.json(
            new APIResponse(
				HTTP_STATUS.OK, 
				{}, 
				"Task deleted and data updated successfully."
			),
            { status: HTTP_STATUS.OK }
        );

    } catch (error) {

        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});