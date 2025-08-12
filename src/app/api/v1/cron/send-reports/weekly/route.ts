import connectDB from "@/database";
import Day from "@/models/day.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { generateText } from "@/utils/generateText";
import { sendWeeklyProgressReportEmail } from "@/utils/mails/sendWeeklyProgressReportEmail";

export const POST = asyncHandler(async (request: NextRequest) => {
	
	const cronSecret = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (cronSecret !== process.env.CRON_SECRET) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid cron secret.");
    }

    await connectDB();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const dayOfWeek = today.getUTCDay();
    const lastSunday = new Date(today);
    lastSunday.setUTCDate(today.getUTCDate() - dayOfWeek);

    const previousMonday = new Date(lastSunday);
    previousMonday.setUTCDate(lastSunday.getUTCDate() - 6);

    // const usersWithWeeklyStats = await User.aggregate([
    //     // look up the Day logs for each user within the last week.
    //     {
    //         $lookup: {
    //             from: "days",
    //             let: { userId: "$_id" },
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: {
    //                             $and: [
    //                                 { $eq: ["$user", "$$userId"] },
    //                                 { $gte: ["$date", previousMonday] },
    //                                 { $lte: ["$date", lastSunday] }
    //                             ]
    //                         }
    //                     }
    //                 }
    //             ],
    //             as: "weeklyLogs"
    //         }
    //     },
    //     // filter out users who had no activity this week.
    //     {
    //         $match: { "weeklyLogs": { $ne: [] } }
    //     },
    //     // look up the user's active discipline 
    //     // calculate stats for each remaining user.
    //     {
    //         $project: {
    //             email: 1,
    //             fullname: 1,
    //             stats: {
    //                 totalTasks: { $sum: { $map: { input: "$weeklyLogs", as: "log", in: { $size: "$$log.taskState" } } } },
    //                 completedTasks: { $sum: { $map: { input: "$weeklyLogs", as: "log", in: { $size: { $filter: { input: "$$log.taskState", as: "ts", cond: "$$ts.isCompleted" } } } } } }
    //             }
    //         }
    //     }
    // ]);

    const usersWithWeeklyStats = await Day.aggregate([
        // find all logs within the past week
        {
            $match: {
                date: {
                    $gte: previousMonday,
                    $lte: lastSunday
                }
            }
        },
        // deconstruct the taskState array to process each task
        {
            $unwind: "$taskState"
        },
        // group by user to calculate their weekly stats
        {
            $group: {
                _id: "$user", // group by the user's id
                totalTasks: { $sum: 1 },
                completedTasks: {
                    $sum: { $cond: [{ $eq: ["$taskState.isCompleted", true] }, 1, 0] }
                },
                // get the id of most recent discipline they worked on this week
                lastDisciplineId: { $last: "$discipline" }
            }
        },
        // look up the user's details (email, fullname)
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        // look up the details of their most recent discipline to get the longest streak
        {
            $lookup: {
                from: "disciplines",
                localField: "lastDisciplineId",
                foreignField: "_id",
                as: "disciplineDetails"
            }
        },
        // filter out any potential mismatches and deconstruct the arrays
        {
            $match: { 
                "userDetails": { $ne: [] }, 
                "disciplineDetails": { $ne: [] } 
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $unwind: "$disciplineDetails"
        },
        // project the final shape for the email service
        {
            $project: {
                _id: 1,
                email: "$userDetails.email",
                fullname: "$userDetails.fullname",
                longestStreak: "$disciplineDetails.longestStreak",
                stats: {
                    totalTasks: "$totalTasks",
                    completedTasks: "$completedTasks"
                }
            }
        }
    ]);

    if (usersWithWeeklyStats.length === 0) {
        return NextResponse.json(
			new APIResponse(
				HTTP_STATUS.OK, 
				{ emailsSent: 0 }, 
				"No users with activity found for this week."
			), 
			{ status: HTTP_STATUS.OK }
		);
    }

    const emailPromises = usersWithWeeklyStats.map(async (user) => {
        try {
            
			const { totalTasks, completedTasks } = user.stats;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            const longestStreak = user.longestStreak;

            const prompt = `A user had a weekly task completion rate of ${completionRate}%. Write a short, encouraging, and actionable insight for their weekly summary email.`;
            const aiInsight = await generateText(prompt);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const dashboardLink = `${baseUrl}/dashboard`;

            await sendWeeklyProgressReportEmail(
                user.email,
                user.fullname,
                String(completionRate),
                String(longestStreak),
                aiInsight,
                dashboardLink
            );

            return { status: "fulfilled", userId: user._id };
        } catch (error) {

            console.error(`Failed to process weekly summary for user ${user._id}:`, error);
            return Promise.reject({ reason: `Error for user ${user._id}`, error });
        }
    });

    const results = await Promise.allSettled(emailPromises);

    const summary = {
        totalUsers: usersWithWeeklyStats.length,
        emailsSent: results.filter((r) => r.status === "fulfilled" && r.value.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
    };

    console.log("Weekly summary job finished.", summary);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            summary,
            "Weekly summary job completed successfully."
        ),
        { status: HTTP_STATUS.OK }
    );
});