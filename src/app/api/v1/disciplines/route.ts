import mongoose from "mongoose";
import connectDB from "@/database";
import { Discipline } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { DISCIPLINE_STATUS, HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler } from "@/utils";
import { getAuthUser } from "@/lib/getAuthUser";

export const GET = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser();

	const disciplines = await Discipline.find({ owner: user.id })
    .sort({ startDate: -1 });

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            disciplines,
            "Disciplines fetched successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

    const session = await mongoose.startSession();
    try {

        session.startTransaction();

        const user = await getAuthUser();
        const userId = user.id;

        const body = await request.json();
        const { name, description, startDate, endDate } = body;
        if (!name?.trim() || !description?.trim() || !startDate?.trim() || !endDate?.trim()) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields are required");
        }

        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setUTCHours(0, 0, 0, 0);

        if (start < now) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Start date cannot be in the past.");
        }
        if (end < start) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "End date cannot be before the start date.");
        }

        // find any expired disciplines for this user that needs their status updated
        const disciplinesToUpdate = await Discipline.aggregate([
            // find all active disciplines for this user that have expired.
            {
                $match: {
                    owner: userId,
                    status: DISCIPLINE_STATUS.ACTIVE,
                    endDate: { $lt: now }
                }
            },
            // look up all associated Day logs for each discipline.
            {
                $lookup: {
                    from: "days",
                    localField: "_id",
                    foreignField: "discipline",
                    as: "logs"
                }
            },
            // deconstruct the logs array to process each day individually.
            {
                $unwind: {
                    path: "$logs",
                    preserveNullAndEmptyArrays: true
                }
            },
            // deconstruct the taskState array to process each task individually.
            {
                $unwind: {
                    path: "$logs.taskState",
                    preserveNullAndEmptyArrays: true,
                }
            },
            // group by discipline to count total and completed tasks.
            {
                $group: {
                    _id: "$_id",
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: {
                            $cond: [{ $eq: ["$logs.taskState.isCompleted", true] }, 1, 0]
                        }
                    }
                }
            },
            // calculate the final completion rate.
            {
                $project: {
                    completionRate: {
                        $cond: {
                            if: { $gt: ["$totalTasks", 0] },
                            then: { $round: [{ $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100] }, 2] },
                            else: 0
                        }
                    }
                }
            }
        ])
        .session(session);

        // If any were found, update them in a bulk operation.
        if (disciplinesToUpdate.length > 0) {

            const bulkUpdateOps = disciplinesToUpdate.map(disc => {
                const newStatus = disc.completionRate >= 75 ? DISCIPLINE_STATUS.COMPLETED : DISCIPLINE_STATUS.FAILED;
                return {
                    updateOne: {
                        filter: { _id: disc._id },
                        update: { $set: { status: newStatus } }
                    }
                };
            });

            await Discipline.bulkWrite(bulkUpdateOps, { session });
        }

        const existingActiveDiscipline = await Discipline.findOne({ 
            owner: userId,
            status: DISCIPLINE_STATUS.ACTIVE,
        })
        .session(session);

        if (existingActiveDiscipline) {
            throw new APIError(HTTP_STATUS.CONFLICT, "You already have an active discipline. Please complete it before creating a new one.");
        }

        const discipline = await Discipline.create({
            name: name?.trim(),
            description: description?.trim(),
            startDate: start,
            endDate: end,
            owner: userId,
            status: DISCIPLINE_STATUS.ACTIVE
        });

        if (!discipline) {
            throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to create discipline. Please try again.");
        }

        await session.commitTransaction();

        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.CREATED,
                discipline,
                "Discipline Created Successfully",
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