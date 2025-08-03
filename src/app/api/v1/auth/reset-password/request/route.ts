import mongoose from "mongoose";
import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { generateToken } from "@/utils/generateToken";
import { hashToken } from "@/utils/hashToken";
import { sendResetPasswordEmail } from "@/utils/mails/sendResetPasswordEmail";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();
	
	const session = await mongoose.startSession();
	try {
		
		session.startTransaction();
		
		const body = await request.json();
        const { email } = body;
        if (!email.trim()) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Email is required");
        }

		const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		if (!isValidEmail) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid email format");
		}

		const user = await User.findOne({ email }).session(session);

		if(user) {

			const resetToken = generateToken(user._id);
			const hashedToken = hashToken(resetToken);
            const resetExpires = new Date(Date.now() + 1800000);

			user.resetPasswordToken = hashedToken;
            user.resetPasswordExpires = resetExpires;
            await user.save({ validateBeforeSave: false, session });

			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

            await sendResetPasswordEmail(
                user.email,
                user.username,
                resetUrl
            );
		}

		await session.commitTransaction();

		return NextResponse.json(
            new APIResponse(
                HTTP_STATUS.OK,
                null, 
                "If an account with this email exists, a password reset link has been sent."
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