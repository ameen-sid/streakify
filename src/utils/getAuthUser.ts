import { jwtVerify } from "jose";
import User from "@/models/user.model";
import { HTTP_STATUS, USER_HIDE_FIELDS } from "@/constant";
import { NextRequest } from "next/server";
import { APIError } from "./APIError";

/** 
 * Verifies the JWT from the request cookies and returns the authenticated user.
 * @param { NextRequest } request The incoming request object.
 * @returns { Promise<UserDocument> } The authenticated Mongoose user document.
 * @throws { APIError } If the user is not authenticated.
**/
const getAuthUser = async (request: NextRequest) => {
	try {

		const token = request.cookies.get("refreshToken")?.value;
		if(!token) {
			throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: No access token provided.");
		}

		let decodedPayload: { _id: string };
		
		const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);
		const { payload } = await jwtVerify(token, secret);
		decodedPayload = payload as { _id: string };
		
		const user = await User.findById(decodedPayload._id).select(USER_HIDE_FIELDS);
		if(!user) {
			throw new APIError(HTTP_STATUS.NOT_FOUND, "User not found.");
		}

		return user;
	} catch(error) {

		throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid or expired token.");
	}
};

export { getAuthUser };