import User from "@/models/user.model";
import { APIError } from "./APIError";

const generateAccessAndRefreshTokens = async (
	userId: string
): Promise<{ accessToken: string, refreshToken: string }> => {
	try {

		const user = await User.findById(userId);
		if(!user) {
			throw new APIError(404, "User not found");
		}

		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {

		if(error instanceof APIError) throw error;
		throw new APIError(
			500,
			"Something went wrong while generating access and refresh token"
		);
	}
};

export { generateAccessAndRefreshTokens };