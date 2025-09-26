import connectDB from "@/database";
import { Discipline } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { DISCIPLINE_STATUS, HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler } from "@/utils";
import { sendInactiveUserEmail } from "@/utils/mails";

export const POST = asyncHandler(async (request: NextRequest) => {

    const cronSecret = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (cronSecret !== process.env.CRON_SECRET) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid cron secret.");
    }

    await connectDB();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const inactiveUsers = await Discipline.aggregate([
        // find all active disciplines
        {
            $match: { 
                status: DISCIPLINE_STATUS.ACTIVE 
            }
        },
        // lookup the day logs for the owner of each discipline
        {
            $lookup: {
                from: "days",
                let: { ownerId: "$owner" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$user", "$$ownerId"] },
                                    { $gte: ["$date", twoDaysAgo] },
                                    { $in: [true, "$taskState.isCompleted"] }
                                ]
                            }
                        }
                    }
                ],
                as: "recentActivity"
            }
        },
        // filter to keep only those disciplines with no recent activity
        {
            $match: {
                recentActivity: { $size: 0 }
            }
        },
        // lookup the full user details for the remaining inactive users
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        // deconstruct the userDetails array and format the output
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                _id: "$userDetails._id",
                email: "$userDetails.email",
                fullname: "$userDetails.fullname"
            }
        }
    ]);

    if (inactiveUsers.length === 0) {
        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK, 
                { emailsSent: 0 }, 
                "No inactive users found."
            ), 
            { status: HTTP_STATUS.OK }
        );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const loginUrl = `${baseUrl}/login`;

    const emailPromises = inactiveUsers.map(user => {

        if (user && user.email) {

            return sendInactiveUserEmail(
                user.email, 
                user.fullname, 
                loginUrl
            )
                .then(() => ({ status: 'fulfilled', userId: user._id }))
                .catch(error => {

                    console.error(`Failed to send inactive user email to ${user._id}:`, error);
                    return { status: 'rejected', userId: user._id, reason: error.message };
                });
        }

        return Promise.resolve({ status: 'skipped', reason: 'User data missing' });
    });

    const results = await Promise.allSettled(emailPromises);

    const summary = {
        totalInactiveUsersFound: inactiveUsers.length,
        emailsSent: results.filter(r => r.status === 'fulfilled' && r.value.status === 'fulfilled').length,
        failedToSend: results.filter(r => r.status === 'fulfilled' && r.value.status === 'rejected').length,
    };

    console.log("Inactive user job finished.", summary);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            summary,
            "Inactive user job completed successfully.",
        ),
        { status: HTTP_STATUS.OK }
    );
});