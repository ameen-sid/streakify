import connectDB from "@/database";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, HTTP_STATUS } from "@/constant";
import { getAuthUser } from "@/utils/getAuthUser";
import { asyncHandler } from "@/utils/asyncHandler";
import { APIError } from "@/utils/APIError";
import { APIResponse } from "@/utils/APIResponse";

export const POST = asyncHandler(async (request: NextRequest) => {
	
	await connectDB();

	const user = await getAuthUser(request);
    const userId = user._id;

	const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $unset: { refreshToken: "" },
        },
        { new: true }
    );

	if(!updatedUser) {
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to logout user.");
	}

	const response = NextResponse.json(
        new APIResponse(
			200, 
			null, 
			"User Logged Out Successfully"
		),
        { status: 200 }
    );

	response.cookies.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });

	return response;
});