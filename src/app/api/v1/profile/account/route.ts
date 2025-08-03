import mongoose from "mongoose";
import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { generateToken } from "@/utils/generateToken";
import { hashToken } from "@/utils/hashToken";
import { sendDeleteAccountScheduleEmail } from "@/utils/mails/sendDeleteAccountScheduleEmail";

export const DELETE = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const session = await mongoose.startSession();
	try {

		session.startTransaction();

		const user = await getAuthUser(request);
        const userId = user._id;

		const userToDelete = await User.findById(userId).session(session);
        if (!userToDelete) {
            throw new APIError(HTTP_STATUS.NOT_FOUND, "User not found");
        }

		if (userToDelete.isDeleted) {
            throw new APIError(HTTP_STATUS.CONFLICT, "Your account is already scheduled for deletion.");
        }
        if (userToDelete.isDeactivated) {
            throw new APIError(HTTP_STATUS.FORBIDDEN, "Your account has been deactivated.");
        }

		const recoveryToken = generateToken(userId);
		const hashedToken = hashToken(recoveryToken);

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				$set: {
					isDeleted: true,
					deletedAt: new Date(),
					deleteAccountToken: hashedToken,
				},
				$unset: { refreshToken: "" }
			},
			{ new: true, session }
		);

		if (!updatedUser) {
            throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to schedule account deletion.");
        }

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const recoveryUrl = `${baseUrl}/recover-account/${recoveryToken}`;

		await sendDeleteAccountScheduleEmail(
            updatedUser.email,
            updatedUser.username,
            recoveryUrl
        );

		await session.commitTransaction();

		const response = NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK,
                null,
                "Your account is scheduled for deletion in 30 days. Please check your email to recover it."
            ),
            { status: HTTP_STATUS.OK }
        );

		response.cookies.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
        response.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });

        return response;
	} catch(error) {

		await session.abortTransaction();
        throw error;
	} finally {
		await session.endSession();
	}
});