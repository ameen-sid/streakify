import { Request, Response, NextFunction } from "express";
import { APIError } from "./APIError";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: AsyncFunction) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {

			await fn(req, res, next);
		} catch (error: unknown) {
			
			const err = error as Partial<APIError>;

			res.status(err.statusCode || 500).json({
				success: false,
				message: err.message || "Internal Server Error",
			});
		}
	};
};

export { asyncHandler };