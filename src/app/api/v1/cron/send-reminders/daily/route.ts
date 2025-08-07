import connectDB from "@/database";
import Day from "@/models/day.model";
import { IDay } from "@/models/day.types";
import { IUser } from "@/models/user.types";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS, MODEL_NAMES } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { sendDailyReminderEmail } from "@/utils/mails/sendDailyReminderEmail";

interface IPopulatedDay extends Omit<IDay, 'user'> {
    user: IUser;
};

export const POST = asyncHandler(async (request: NextRequest) => {
    
    const cronSecret = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (cronSecret !== process.env.CRON_SECRET) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid cron secret.");
    }

    await connectDB();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const logsWithIncompleteTasks = await Day.find({
        date: today,
        "taskState.isCompleted": false,
    })
    .populate<IPopulatedDay>({
        path: 'user',
        model: MODEL_NAMES.USER,
        select: 'email username'
    });

    if (logsWithIncompleteTasks.length === 0) {
        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK, 
                { remindersSent: 0 }, 
                "No users with incomplete tasks found."
            ),
            { status: HTTP_STATUS.OK }
        );
    }

    const emailPromises = logsWithIncompleteTasks.map(log => {
        
        const user = log.user;
        if (user && user.email) {
            
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const tasksLink = `${baseUrl}/today`;

            return sendDailyReminderEmail(
                user.email, 
                user.username, 
                tasksLink
            )
                .then(() => ({ status: 'fulfilled', userId: user._id }))
                .catch(error => {
                    
                    console.error(`Failed to send reminder to user ${user._id}:`, error);
                    return { status: 'rejected', userId: user._id, reason: error.message };
                });
        }
        
        return Promise.resolve({ status: 'skipped', reason: 'User data missing' });
    });

    const results = await Promise.allSettled(emailPromises);

    const summary = {
        totalUsersToRemind: logsWithIncompleteTasks.length,
        remindersSent: results.filter(r => r.status === 'fulfilled' && r.value.status === 'fulfilled').length,
        failedToSend: results.filter(r => r.status === 'fulfilled' && r.value.status === 'rejected').length,
    };

    console.log("Daily reminder job finished.", summary);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            summary,
            "Daily reminder job completed successfully.",
        ),
        { status: HTTP_STATUS.OK }
    );
});