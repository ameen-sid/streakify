"use server";

import { Types } from "mongoose";
import { User } from "@/models";
import { HTTP_STATUS } from "@/constant";
import { APIError, hashToken } from "@/utils";

const generateAccessAndRefreshTokens = async (
	userId: Types.ObjectId
): Promise<{ accessToken: string, refreshToken: string }> => {
	try {

		const user = await User.findById(userId);
		if(!user) {
			throw new APIError(HTTP_STATUS.NOT_FOUND, "User not found");
		}

		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		const hashedRefreshToken = hashToken(refreshToken);

		user.refreshToken = hashedRefreshToken;

		const updatedUser = await user.save({ validateBeforeSave: false });
		if(!updatedUser) {
			throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to save refresh token");
		}

		return { accessToken, refreshToken };
	} catch (error) {

		if(error instanceof APIError) throw error;
		throw new APIError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong while generating access and refresh token");
	}
};

export { generateAccessAndRefreshTokens };