import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler } from "@/utils";

export const POST = asyncHandler(async (request: NextRequest) => {

    const cronSecret = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (cronSecret !== process.env.CRON_SECRET) {
        throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid cron secret.");
    }

    await connectDB();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const thirtyDaysBack = new Date(today);
    thirtyDaysBack.setUTCDate(today.getUTCDate() - 30);

    const result = await User.updateMany(
        {
            isDeleted: true,
            deletedAt: { $lte: thirtyDaysBack }
        },
        {
            $set: {
                isDeactivated: true,
            },
            $unset: {
                deleteAccountToken: "",
                refreshToken: "",
            }
        }
    );

    const accountsDeactivated = result.modifiedCount;

    if (accountsDeactivated === 0) {
        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK, 
                { accountsDeactivated: 0 }, 
                "No accounts found for deactivation."
            ),
            { status: HTTP_STATUS.OK }
        );
    }

    const summary = { accountsDeactivated };

    console.log("Account deactivation job finished.", summary);

    return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            summary,
            `${accountsDeactivated} account(s) have been successfully deactivated.`,
        ),
        { status: HTTP_STATUS.OK }
    );
});