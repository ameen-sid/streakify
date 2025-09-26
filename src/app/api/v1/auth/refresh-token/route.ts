import connectDB from "@/database";
import { User } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_OPTIONS, HTTP_STATUS } from "@/constant";
import { 
	APIError, 
	APIResponse, 
	asyncHandler, 
	getAuthUser, 
	generateAccessAndRefreshTokens, 
	hashToken 
} from "@/utils";

export const POST = asyncHandler(async (request: NextRequest) => {

	await connectDB();

	const incomingRefreshToken = request.cookies.get("refreshToken")?.value;
	if(!incomingRefreshToken?.trim()) {
		throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Refresh Token is required.");
	}

	const userId = (await getAuthUser(request))._id;

	const user = await User.findById(userId);
	if(!user) {
		throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token: User not found");
	}

	const hashedToken = hashToken(incomingRefreshToken);
	if (hashedToken !== user?.refreshToken) {
		throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is expired or has been used");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

	const response = NextResponse.json(
        new APIResponse(
            HTTP_STATUS.OK,
            {
                accessToken,
                refreshToken,
            },
            "Access token refreshed successfully",
        ),
        { status: HTTP_STATUS.OK }
    );

	response.cookies.set("accessToken", accessToken, COOKIE_OPTIONS);
    response.cookies.set("refreshToken", refreshToken, COOKIE_OPTIONS);

    return response;
});