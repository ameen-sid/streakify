import mongoose from "mongoose";
import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_OPTIONS, HTTP_STATUS } from "@/constant";
import { 
	APIError, 
	APIResponse, 
	asyncHandler, 
	generateAccessAndRefreshTokens, 
	hashToken, 
	sanitizeUser 
} from "@/utils";
import { sendWelcomeEmail } from "@/utils/mails";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const session = await mongoose.startSession();
	try {

		session.startTransaction();

		const body = await request.json();
        const { token } = body;
        if (!token.trim()) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Verification token is required");
        }

		const hashedToken = hashToken(token);

		const user = await User.findOneAndUpdate(
            { verifyEmailToken: hashedToken },
            {
                $set: { isVerified: true },
                $unset: { verifyEmailToken: "" }
            },
            { new: true, session }
        );

		if (!user) {
            throw new APIError(HTTP_STATUS.NOT_FOUND, "Invalid or expired verification token");
        }

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const disciplinePageLink = `${baseUrl}/disciplines`;

		await sendWelcomeEmail(
			user.email, 
			user.username, 
			disciplinePageLink
		);

		await session.commitTransaction();

		const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

		const cookieStore = await cookies();
		cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS);
		cookieStore.set("refreshToken", refreshToken, COOKIE_OPTIONS);

        return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK,
                { user: sanitizeUser(user) },
                "User Verified Successfully"
            ),
            { status: HTTP_STATUS.OK }
        );
	} catch(error) {

		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
});