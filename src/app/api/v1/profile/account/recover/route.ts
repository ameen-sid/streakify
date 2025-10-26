import mongoose from "mongoose";
import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, hashToken } from "@/utils";
import { sendRecoverAccountEmail } from "@/utils/mails";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const session = await mongoose.startSession();
	try {

		session.startTransaction();

		const body = await request.json();
        const { token } = body;
        if (!token.trim()) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Recovery token is required");
        }

		const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const hashedToken = hashToken(token);

		const user = await User.findOneAndUpdate(
			{
				deleteAccountToken: hashedToken,
				deletedAt: { $gt: thirtyDaysAgo }
			},
			{
				$unset: {
					isDeleted: "",
					deletedAt: "",
					deleteAccountToken: ""
				}
			},
			{ new: true, session }
		);

		if (!user) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid or expired recovery token. Please try again.");
        }

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const loginUrl = `${baseUrl}/login`;

        await sendRecoverAccountEmail(
            user.email,
            user.username,
            loginUrl
        );

		await session.commitTransaction();

		// const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

		const response = NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK,
                null, 
                "Account recovered successfully"
            ),
            { status: HTTP_STATUS.OK }
        );

		// response.cookies.set("accessToken", accessToken, COOKIE_OPTIONS);
        // response.cookies.set("refreshToken", refreshToken, COOKIE_OPTIONS);

        return response;
	} catch(error) {

		await session.abortTransaction();
        throw error;
	} finally {
		await session.endSession();
	}
});