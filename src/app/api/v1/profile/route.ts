import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler, sanitizeUser } from "@/utils";
import { getAuthUser } from "@/lib/getAuthUser";

export const GET = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser();
	if(!user) {
		throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
	}

	// const session = await auth();
	// if(!session?.user) {
	// 	throw new APIError(HTTP_STATUS.BAD_REQUEST, "Unauthorized");
	// }
	
	// const userId = session.user.id;
	const userId = user.id;

	// const sanitizedUser = sanitizeUser(session?.user);

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            // session?.user,
            user,
            "User profile fetched successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});

export const PATCH = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser();
    const userId = user.id;

	const body = await request.json();
    const { fullname, dateOfBirth, gender } = body;
    if (!fullname?.trim() || !dateOfBirth?.trim() || !gender?.trim()) {
        throw new APIError(HTTP_STATUS.BAD_REQUEST, "Full name, date of birth, and gender are required");
    }

	const updatedUser = await User.findByIdAndUpdate(
		userId,
		{
			$set: {
				fullname,
				dateOfBirth,
				gender,
			}
		},
		{
			new: true,
			runValidators: true
		}
	);

	if (!updatedUser) {
        throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to update user profile");
    }

	const sanitizedUser = sanitizeUser(updatedUser);

	return NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            sanitizedUser,
            "User profile updated successfully",
        ),
        { status: HTTP_STATUS.OK }
    );
});