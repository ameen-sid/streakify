import { NextRequest, NextResponse } from "next/server";
import { APIError } from "./APIError";
import { APIResponse } from "./APIResponse";

type AsyncFunction = (req: NextRequest) => Promise<NextResponse>;

const asyncHandler = (fn: AsyncFunction) => {
	return async (req: NextRequest): Promise<NextResponse> => {
		try {

			return await fn(req);
		} catch (error) {
			
			const err = error as APIError;
			const status = typeof err.statusCode === 'number' ? err.statusCode : 500;

			return NextResponse.json(
				new APIResponse(status, null, err.message || "Internal Server Error"),
				{ status }
			);
		}
	};
};

export { asyncHandler };