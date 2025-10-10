import mongoose from "mongoose";
import connectDB from "@/database";
import { ContactMessage } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler } from "@/utils";
import { sendContactFormNotificationEmail, sendContactFormConfirmationEmail } from "@/utils/mails";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const session = await mongoose.startSession();
	session.startTransaction();
	try {

		const body = await request.json();
		const { fullname, email, reason, message } = body;
		if(!fullname?.trim() || !email?.trim() || !reason?.trim() || !message?.trim()) {
			throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields are required.");
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid email format");
		}

		const newMessages = await ContactMessage.create([{
            fullname,
            email,
            reason,
            message,
        }], { session });

		const newContactMessage = newMessages[0];
		if (!newContactMessage) {
            throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to save the message.");
        }

		await Promise.all([
			sendContactFormNotificationEmail(
				newContactMessage.fullname,
                newContactMessage.email,
                newContactMessage.reason,
                newContactMessage.message
			),

			sendContactFormConfirmationEmail(
				newContactMessage.fullname,
                newContactMessage.email
			)
		]);

		await session.commitTransaction();

		return NextResponse.json(
			new APIResponse(
				HTTP_STATUS.CREATED,
				{},
				"Your message has been sent successfully. We will get back to you shortly."
			),
			{ status: HTTP_STATUS.CREATED },
		);
	} catch(error) {
		await session.abortTransaction();

		if (error instanceof Error && error.name === 'ValidationError') {

			const validationError = error as mongoose.Error.ValidationError;
            const firstError = Object.values(validationError.errors)[0].message;
            throw new APIError(HTTP_STATUS.BAD_REQUEST, firstError);
        }

		throw error;
	} finally {
		await session.endSession();
	}
});