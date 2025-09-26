import connectDB from "@/database";
import { Discipline, Task, Day } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { DISCIPLINE_STATUS, HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, getAuthUser } from "@/utils";

export const GET = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

	let dayLog = await Day.findOne({ user: userId, date: today });
	if(!dayLog) {

		const activeDiscipline = await Discipline.findOne({
            owner: userId,
            status: DISCIPLINE_STATUS.ACTIVE,
        });

		if (!activeDiscipline) {
			return NextResponse.json(
                new APIResponse(
					HTTP_STATUS.OK, 
					{ 
						day: null, 
						discipline: null 
					}, 
					"User has no active discipline."
				),
				{ status: HTTP_STATUS.OK }
            );
        }

		const tasks = await Task.find({ discipline: activeDiscipline._id });

		const taskStateData = tasks.map(task => ({
            task: task._id,
            isCompleted: false,
        }));

		dayLog = await Day.create({
            date: today,
            user: userId,
            discipline: activeDiscipline._id,
            taskState: taskStateData,
        });
	}

	const populatedDayLog = await Day.findById(dayLog._id)
	.populate({
        path: "taskState.task",
        model: "Task"
    });

	const discipline = await Discipline.findOne({ 
		owner: userId, 
		status: DISCIPLINE_STATUS.ACTIVE 
	})
    .select("_id name currentStreak longestStreak");

	if (!populatedDayLog) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to fetch or create today's log.");
    }

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            {
                day: populatedDayLog,
                discipline: discipline
            },
            "Today's Log Fetched Successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});