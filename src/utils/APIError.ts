class APIError extends Error {
	statusCode: number;
	data: Record<string, unknown>;
	success: boolean;
	errors: any[];

	constructor(statusCode: number, message: string = "Something went wrong", errors: any[] = [], stack?: string) {
		
		super(message);

		this.statusCode = statusCode;
		this.data = {};
		this.success = false;
		this.errors = errors;

		if (stack)	this.stack = stack;
		else	Error.captureStackTrace(this, this.constructor);
	}
};

export { APIError };
