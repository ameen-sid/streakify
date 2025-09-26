import connectDB from "@/database";
import { Discipline } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { MODEL_NAMES, HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler } from "@/utils";
import { sendUpcomingDisciplineReminderEmail } from "@/utils/mails";

export const POST = asyncHandler(async (request: NextRequest) => {

    const cronSecret = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (cronSecret !== process.env.CRON_SECRET) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid cron secret.");
    }

    await connectDB();

    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    const upcomingDisciplines = await Discipline.find({ startDate: tomorrow })
	.populate<{ owner: { _id: string; email: string; fullname: string } }>({
        path: 'owner',
        model: MODEL_NAMES.USER,
        select: 'email fullname'
    });

    if (upcomingDisciplines.length === 0) {
        return NextResponse.json(
            new APIResponse(
				HTTP_STATUS.OK, 
				{ emailsSent: 0 }, 
				"No disciplines starting tomorrow."
			),
            { status: HTTP_STATUS.OK }
        );
    }

    const emailPromises = upcomingDisciplines.map(discipline => {

        const user = discipline.owner;
        if (user && user.email) {

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const disciplineLink = `${baseUrl}/disciplines/${discipline._id}`;

            return sendUpcomingDisciplineReminderEmail(
				user.email, 
				user.fullname, 
				discipline.name, 
				disciplineLink
			)
                .then(() => ({ status: 'fulfilled', userId: user._id }))
                .catch(error => {

					console.error(`Failed to send upcoming reminder to user ${user._id}:`, error);
                    return { status: 'rejected', userId: user._id, reason: error.message };
                });
        }

        return Promise.resolve({ status: 'skipped', reason: 'User data missing' });
    });

    const results = await Promise.allSettled(emailPromises);

    const summary = {
        totalDisciplinesStartingTomorrow: upcomingDisciplines.length,
        emailsSent: results.filter(r => r.status === 'fulfilled' && r.value.status === 'fulfilled').length,
        failedToSend: results.filter(r => r.status === 'fulfilled' && r.value.status === 'rejected').length,
    };

    console.log("Upcoming discipline reminder job finished.", summary);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            summary,
            "Upcoming discipline reminder job completed successfully.",
        ),
        { status: HTTP_STATUS.OK }
    );
});