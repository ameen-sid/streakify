import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, HTTP_STATUS } from "@/constant";
import { APIError, APIResponse, asyncHandler } from "@/utils";
import { getAuthUser } from "@/lib/getAuthUser";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const user = await getAuthUser();
    const userId = user.id;

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
			HTTP_STATUS.OK, 
			null, 
			"User Logged Out Successfully"
		),
        { status: HTTP_STATUS.OK }
    );

	response.cookies.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    response.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });

	return response;
});