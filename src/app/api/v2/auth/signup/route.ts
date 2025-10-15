import mongoose from "mongoose";
import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HTTP_STATUS, COOKIE_OPTIONS } from "@/constant";
import { 
    APIError, 
    APIResponse, 
    asyncHandler, 
    generateToken, 
    generatePlaceholder, 
    hashToken, 
    sanitizeUser 
} from "@/utils";
import { sendVerificationEmail } from "@/utils/mails";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const session = await mongoose.startSession();
    session.startTransaction();
	try {

		const body = await request.json();
        const { username, email, password } = body;
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
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

		const avatar = generatePlaceholder(username);

		const user = new User({
            username: username.toLowerCase().trim(),
            email: email.trim(),
            avatar,
            password,
        });

		const verificationToken = generateToken(user._id);
        const hashedToken = hashToken(verificationToken);
        user.verifyEmailToken = hashedToken;

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        const hashedRefreshToken = hashToken(refreshToken);
        user.refreshToken = hashedRefreshToken;

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

        const cookieStore = await cookies();
        cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS);
        cookieStore.set("refreshToken", refreshToken, COOKIE_OPTIONS);

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