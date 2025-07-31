import mongoose from "mongoose";
import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";
import { generateToken } from "@/utils/generateToken";
import { generatePlaceholder } from "@/utils/generatePlaceholder";
import { sanitizeUser } from "@/utils/sanitizeUser";
import { sendVerificationEmail } from "@/utils/mails/sendVerificationEmail";

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();
	
	const session = await mongoose.startSession();
    session.startTransaction();
	try {

		const body = await request.json();
        const { username, email, fullname, gender, password } = body;
        if (!username || !email || !fullname || !gender || !password) {
            throw new APIError(HTTP_STATUS.BAD_REQUEST, "All fields are required");
        }

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
  			throw new APIError(HTTP_STATUS.BAD_REQUEST, "Invalid email format");
		}

		const existedUser = await User.findOne({
            $or: [{ username: username.toLowerCase() }, { email }],
        })
		.session(session);

        if (existedUser) {
            throw new APIError(HTTP_STATUS.CONFLICT, "User with this email or username already exists");
        }

		const avatar = generatePlaceholder(fullname);

		const user = new User({
            username: username.toLowerCase(),
            email,
            fullname,
            avatar,
            gender,
            password,
        });

		const verificationToken = generateToken(user._id);
        user.verifyEmailToken = verificationToken;

		const createdUser = await user.save({ session });
        if (!createdUser) {
            throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to create user");
        }

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const verificationUrl = `${baseUrl}/verify-email/${verificationToken}`;

		await sendVerificationEmail(
            createdUser.email,
            createdUser.username,
            verificationUrl
        );

		await session.commitTransaction();

		return NextResponse.json(
            new APIResponse(
				HTTP_STATUS.CREATED, 
				sanitizeUser(createdUser), 
				"User Registered Successfully. Please check your email to verify."
			),
            { status: HTTP_STATUS.CREATED },
        );
	} catch(error) {

		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
});