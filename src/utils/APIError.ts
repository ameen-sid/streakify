import { DEFAULT_ERROR_MESSAGE } from "@/constant";

class APIError extends Error {
	
	statusCode: number;
	data: Record<string, unknown> | null;
	success: boolean;
	errors: Error[];

	constructor(
		statusCode: number, 
		message: string = DEFAULT_ERROR_MESSAGE, 
		errors: Error[] = [], 
		stack?: string
	) {
		
		super(message);
		this.statusCode = statusCode;
		this.data = null;
		this.success = false;
		this.errors = errors;

		if (stack)	this.stack = stack;
		else	Error.captureStackTrace(this, this.constructor);
	}
};

export { APIError };