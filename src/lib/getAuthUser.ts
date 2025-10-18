import { auth } from "@/lib/auth";
import { HTTP_STATUS } from "@/constant";
import { APIError } from "@/utils";

const getAuthUser = async () => {
	try {

		const session = await auth();
		if(!session?.user) {
			throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: No token provided");
		}

		return session?.user;
	} catch(error) {
		throw new APIError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized: Invalid or expired token.");
	}
};

export { getAuthUser };