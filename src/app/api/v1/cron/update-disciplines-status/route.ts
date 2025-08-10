import connectDB from "@/database";
import Discipline from "@/models/discipline.model";
import { NextRequest, NextResponse } from "next/server";
import { DISCIPLINE_STATUS, HTTP_STATUS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const POST = asyncHandler(async (request: NextRequest) => {
    
    const cronSecret = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (cronSecret !== process.env.CRON_SECRET) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid cron secret.");
    }

    await connectDB();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const aggregationPipeline = [
        // find all active disciplines that have expired
        {
            $match: {
                status: DISCIPLINE_STATUS.ACTIVE,
                endDate: { $lt: today },
            }
        },
        // lookup all associated day logs for each discipline
        {
            $lookup: {
                from: "days",
                localField: "_id",
                foreignField: "discipline",
                as: "logs"
            }
        },
        // deconstruct the logs array to process each day individually
        {
            $unwind: {
                path: "$logs",
                preserveNullAndEmptyArrays: true,
            }
        },
        // deconstruct the taskState array to process each task individually
        {
            $unwind: {
                path: "$logs.taskState",
                preserveNullAndEmptyArray: true,
            }
        },
        // group by discipline to count total and completed tasks
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
        // calculate the final completion rate
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
    ];

    const disciplinesToUpdate = await Discipline.aggregate(aggregationPipeline);
    if (disciplinesToUpdate.length === 0) {
        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK, 
                { updated: 0 }, 
                "No expired disciplines found to update."
            ),
            { status: HTTP_STATUS.OK }
        );
    }

    const bulkUpdateOps = disciplinesToUpdate.map(disc => {
        
        const newStatus = disc.completionRate >= 75 ? DISCIPLINE_STATUS.COMPLETED : DISCIPLINE_STATUS.FAILED;
        return {
            updateOne: {
                filter: { _id: disc._id },
                update: { $set: { status: newStatus } }
            }
        };
    });

    const result = await Discipline.bulkWrite(bulkUpdateOps);

    const summary = {
        totalProcessed: disciplinesToUpdate.length,
        updatedToCompleted: disciplinesToUpdate.filter(d => d.completionRate >= 75).length,
        updatedToFailed: disciplinesToUpdate.filter(d => d.completionRate < 75).length,
        dbResult: result,
    };

    console.log("Discipline status update job finished.", summary);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            summary,
            "Discipline status update job completed successfully.",
        ),
        { status: HTTP_STATUS.OK }
    );
});