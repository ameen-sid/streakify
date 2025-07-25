import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

/**
 * @route GET /api/v1/dashboard
 * @description Fetches all aggregated data for the dashboard for a specific month.
 * @param {string} month - The month to fetch data for, in "YYYY-MM" format (e.g., "2025-07").
 * @access Private (Requires user to be logged in)
 */
export const GET = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	// 1. get user and validate input
	const userId = request.cookies.get("user-id")?.value;
	if(!userId) {
		throw new APIError(401, "Unauthorized: User is not authenticated.");
	}
	
	const userAvatar = request.cookies.get("user-avatar")?.value;

	const { searchParams } = new URL(request.url);
	const month = searchParams.get("month");
	if(!month || !/^\d{4}-\d{2}$/.test(month)) {
		throw new APIError(400, "Invalid month format. Please use YYYY-MM");
	}

	// 2. calculate date range for the query
	const year = parseInt(month.split('-')[0]);
	const monthIndex = parseInt(month.split('-')[1]) - 1;
	const startDate = new Date(year, monthIndex, 1);
	const endDate = new Date(year, monthIndex + 1, 0);

	// 3. fetch all relevant logs for the month
	const monthlyLogs = await Day.find({
		user: userId,
		date: {
			$gte: startDate,
			$lte: endDate,
		},
	}).populate({
		path: "taskState.task",
		model: "Task",
		select: "name"
	});

	// ek cron job jesa kuch chalana padega daily morning ya kisi time jab woh day model me entry kre or daale kon konse tasks hai user ke
	// monthlyLogs = [
	// 	{
	// 		date: Date,
	// 		user: ObjectId,
	// 		discipline: ObjectId,
	// 		taskState: [
	// 			{
	// 				task: {
	// 					name: string
	// 				},
	// 				isCompleted: boolean,
	// 			},
	// 			{},
	// 		],
	// 		highlight: string,
	// 	},
	// 	{},
	// 	{},
	// ];

	if(!monthlyLogs) {
		throw new APIError(404, "No data found for the selected month");
	}

	if(monthlyLogs.length === 0) {
		return NextResponse.json(
			new APIResponse(
				200,
				{
					userAvatar
				},
				"Dashboard Not Present",
			),
			{ status: 200 }
		);
	}

	// 4. process and aggregate the data
	let totalTasksInMonth = 0;
	let totalCompletedTasks = 0;
	let longestStreak = 0;
	let currentStreak = 0;
	const taskCompletionCounts: Record<string, number> = {};

	monthlyLogs.sort((a, b) => a.date.getTime() - b.date.getTime()).forEach((log, index) => {

		const completedCount = log.taskState.filter(ts => ts.isCompleted).length;
		totalCompletedTasks += completedCount;
		totalTasksInMonth += log.taskState.length;

		if(completedCount > 0 && completedCount === log.taskState.length)	currentStreak++;
		else {

			if(currentStreak > longestStreak)	longestStreak = currentStreak;
			currentStreak = 0;
		}

		if(index === monthlyLogs.length - 1 && currentStreak > longestStreak)	longestStreak = currentStreak;

		log.taskState.forEach(ts => {

			const task = ts.task;
			if(ts.isCompleted && typeof ts.task === "object" && ts.task !== null && "name" in ts.task) {

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
		data: Object.keys(taskCompletionCounts),
	};

	// 5. construct the final response
	const dashboardData = {
        monthlyStats,
        taskBreakdown,
		userAvatar,
    };

	// dashboardData = {
	// 	monthlyStats: {
	// 		completionRate: string,
	// 		longestStreak: string,
	// 		mostConsistentTask: string,
	// 	},
	// 	taskBreakdown: {
	// 		labels: [ {}, {}, {} ],
	// 		data: [ {}, {}, {} ],
	// 	},
		// avatar: string,
	// };

    return NextResponse.json(
		new APIResponse(
			200,
			dashboardData,
			"Dashboard Data Fetched Successfully",
		),
		{ status: 200 }
	);
});