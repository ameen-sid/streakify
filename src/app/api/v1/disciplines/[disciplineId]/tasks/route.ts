import mongoose from "mongoose";
import connectDB from "@/database";
import { Discipline, Task, Day } from "@/models";
import { ITaskState } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, getAuthUser } from "@/utils";

export const GET = asyncHandler(async (request: NextRequest, { params }: { params: { disciplineId: string } }) => {

	await connectDB();

	const user = await getAuthUser(request);

	const { disciplineId } = await params;
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

	const session = await mongoose.startSession();
    try {

        session.startTransaction();

        const user = await getAuthUser(request);

        const { disciplineId } = await params;
        if (!disciplineId) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Discipline ID is required");
        }

        const discipline = await Discipline.findOne({ 
            _id: disciplineId, 
            owner: user._id 
        })
        .session(session);

        if (!discipline) {
            throw new APIError(HTTP_STATUS.NOT_FOUND, "Discipline not found or you do not have permission to add tasks to it.");
        }

        const body = await request.json();
        const { name, description, priority } = body;
        if (!name?.trim() || !description?.trim() || !priority) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields (name, description, priority) are required");
        }

        const createdTask = await Task.create({
            name,
            description,
            priority,
            discipline: disciplineId,
        });

        if (!createdTask) {
            throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to create task. Please try again.");
        }

        // update today's log (if it exists)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const todayLog = await Day.findOne({
            user: user._id,
            date: today,
            discipline: disciplineId
        })
        .session(session);

        if(todayLog) {

            const completedBefore = todayLog.taskState.filter(ts => ts.isCompleted).length;
            const totalBefore = todayLog.taskState.length;
            const rateBefore = totalBefore > 0 ? (completedBefore / totalBefore) * 100 : 0;
            const wasTodayAStreakDay = rateBefore >= 75;

            todayLog.taskState.push({
                task: createdTask._id,
                isCompleted: false
            } as ITaskState);
            await todayLog.save({ session });

            const completedAfter = todayLog.taskState.filter(ts => ts.isCompleted).length;
            const totalAfter = todayLog.taskState.length;
            const rateAfter = totalAfter > 0 ? (completedAfter / totalAfter) * 100 : 0;

            if (wasTodayAStreakDay && rateAfter < 75) {

                await Discipline.updateOne(
                    { _id: disciplineId, owner: user._id },
                    { $inc: { currentStreak: -1 } }
                )
                .session(session);
            }
        }

        // if no log exists for today, we don't need to do anything
        await session.commitTransaction();

        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.CREATED,
                createdTask,
                "Task Created and Today's Log Updated Successfully",
            ),
            { status: HTTP_STATUS.CREATED }
        );
    } catch(error) {

        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
});