import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_EXPIRY, HTTP_STATUS } from "@/constant";
import { APIError } from "./APIError";

const generateToken = (userId: Types.ObjectId): string => {
	try {
		
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			
			console.error("JWT_SECRET environment variable is not defined.");
			throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error: Token secret not configured.");
		}

		const token = jwt.sign({ userId }, jwtSecret, { expiresIn: JWT_EXPIRY });
		
		return token;
	} catch (error) {
		
		console.error("Error while generating token: ", error);
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong while generating the token.");
	}
};

export { generateToken };