import mongoose from "mongoose";
import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { 
    APIError, 
    APIResponse, 
    asyncHandler, 
    generateToken, 
    hashToken
} from "@/utils";
import { sendVerificationEmail } from "@/utils/mails";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const session = await mongoose.startSession();
    session.startTransaction();
	try {

		const body = await request.json();
        const { email } = body;
        if (!email?.trim()) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Email is required");
        }

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid email format");
		}

		const existedUser = await User.findOne({ email }).session(session);
        if (!existedUser) {
			return NextResponse.json(
                new APIResponse(
                    HTTP_STATUS.OK,
                    {},
                    "If an account with that email exists, a verification link has been sent."
                ),
                { status: HTTP_STATUS.OK }
            );
        }

		if (existedUser.isVerified) {
            return NextResponse.json(
                new APIResponse(
                    HTTP_STATUS.OK,
                    {},
                    "If an account with that email exists, a verification link has been sent."
                ),
                { status: HTTP_STATUS.OK }
            );
        }

		const verificationToken = generateToken(existedUser._id);
        const hashedToken = hashToken(verificationToken);

        existedUser.verifyEmailToken = hashedToken;

		const updatedUser = await existedUser.save({ session });
        if (!updatedUser) {
            throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update user with new token");
        }

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const verificationUrl = `${baseUrl}/verify-email/${verificationToken}`;

		await sendVerificationEmail(
            updatedUser.email,
            updatedUser.username,
            verificationUrl
        );

		await session.commitTransaction();

		return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK,
                {},
                "A new verification link has been sent to your email."
            ),
            { status: HTTP_STATUS.OK },
        );
	} catch(error) {

		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
});