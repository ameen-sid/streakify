import connectDB from "@/database";
import { Day } from "@/models";
import { ITask, IDay } from "@/models/types";
import { NextRequest, NextResponse } from "next/server";
import { MODEL_NAMES, HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, getAuthUser } from "@/utils";

interface IPopulatedDay extends Omit<IDay, 'taskState'> {
    taskState: {
        task: ITask;
        isCompleted: boolean;
    }[];
}

/**
 * @route GET /api/v1/dashboard
 * @description Fetches all aggregated data for the dashboard for a specific month.
 * @param {string} month - The month to fetch data for, in "YYYY-MM" format (e.g., "2025-07").
 * @access Private (Requires user to be logged in)
 */
export const GET = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid month format. Please use YYYY-MM");
    }

	const year = parseInt(month.split('-')[0]);
    const monthIndex = parseInt(month.split('-')[1]) - 1;

    const startDate = new Date(Date.UTC(year, monthIndex, 1));

    const endDate = new Date(Date.UTC(year, monthIndex + 1, 1));
    endDate.setUTCMilliseconds(-1);

	const monthlyLogs = await Day.find({
		user: userId,
		date: {
			$gte: startDate,
			$lte: endDate,
		},
	}).populate({
		path: "taskState.task",
		model: MODEL_NAMES.TASK,
		select: "name"
	}) as unknown as IPopulatedDay[];

	if (monthlyLogs.length === 0) {
        return NextResponse.json(
            new APIResponse(
				HTTP_STATUS.OK, 
				{}, 
				"No data found for the selected month"
			),
            { status: HTTP_STATUS.OK }
        );
    }

	let totalTasksInMonth = 0;
    let totalCompletedTasks = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    const taskCompletionCounts: Record<string, number> = {};

	monthlyLogs.sort((a, b) => a.date.getTime() - b.date.getTime()).forEach((log, index) => {

		const completedCount = log.taskState.filter(ts => ts.isCompleted).length;
		totalCompletedTasks += completedCount;
		totalTasksInMonth += log.taskState.length;

		const dailyCompletionRate = log.taskState.length > 0 ? (completedCount / log.taskState.length) * 100 : 0;

		if (dailyCompletionRate >= 75)	currentStreak++;
		else {

			if (currentStreak > longestStreak)	longestStreak = currentStreak;
			currentStreak = 0;
		}

		if (index === monthlyLogs.length - 1 && currentStreak > longestStreak)	longestStreak = currentStreak;

		log.taskState.forEach(ts => {
			
			if (ts.isCompleted && ts.task) {
				const taskName = (ts.task as { name: string }).name;
				taskCompletionCounts[taskName] = (taskCompletionCounts[taskName] || 0) + 1;
			}
		});
	});

	const completionRate = totalTasksInMonth > 0 ? Math.round((totalCompletedTasks / totalTasksInMonth) * 100) : 0;
    const mostConsistentTask = Object.keys(taskCompletionCounts).reduce((a, b) => taskCompletionCounts[a] > taskCompletionCounts[b] ? a : b, 'N/A');

	const monthlyStats = {
        completionRate: `${completionRate}%`,
        longestStreak: `${longestStreak} Days`,
        mostConsistentTask,
    };

    const taskBreakdown = {
        labels: Object.keys(taskCompletionCounts),
        data: Object.values(taskCompletionCounts), 
	};

    const dashboardData = {
        monthlyStats,
        taskBreakdown,
    };

	return NextResponse.json(
		new APIResponse(
			HTTP_STATUS.OK,
			dashboardData,
			"Dashboard Data Fetched Successfully",
		),
		{ status: HTTP_STATUS.OK }
	);
});