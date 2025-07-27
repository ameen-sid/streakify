// --- DATABASE ---
export const DB_NAME = "DisciplinePlanner";

// --- GEMINI AI ---
export const MODEL_NAME =  "gemini-1.5-flash-latest";

// --- JWT ---
export const JWT_EXPIRY = "1d";

// --- DISCIPLINE STATUS ---
export const DISCIPLINE_STATUS = {
	ACTIVE: 'Active',
	COMPLETED: 'Completed',
	FAILED: 'Failed',
	UPCOMING: 'Upcoming',
	UNKNOWN: 'Unknown',
} as const;	// 'as const' makes it a readonly object

// --- APPLICATION ---
export const APP_NAME = "Discipline Planner";

// --- CLOUDINARY ---
export const FOLDER_NAME = "User Avatars";
export const RESOURCE_TYPE = "auto";

// --- SANITIZE USER ---
export const SENSITIVE_USER_FIELDS = [
	"password",
	"refreshToken",
	"verifyEmailToken",
	"resetPasswordToken",
	"resetPasswordExpires",
	"isDeleted",
	"deletedAt",
	"deleteAccountToken",
	"isDeactivated",
] as const;	// "as const" makes it a readonly tuple with literal types

// --- API ERROR ---
export const HTTP_STATUS_API_ERROR = {
	// Client Errors
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	
	// Server Errors
	INTERNAL_SERVER_ERROR: 500,
} as const;
export const DEFAULT_ERROR_MESSAGE = "Something went wrong";

// --- API RESPONSE ---
export const HTTP_STATUS = {
	// Success
	OK: 200,
	CREATED: 201,

	// Client Errors
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,

	// Server Errors
	INTERNAL_SERVER_ERROR: 500,
} as const;
export const DEFAULT_SUCCESS_MESSAGE = "Success";

// --- EMAIL CONSTANTS ---
export const EMAIL_SUBJECTS = {
    WELCOME: "Welcome to Discipline Planner!",
    VERIFY_EMAIL: "Please Verify Your Email Address",
    RESET_PASSWORD: "Reset Your Discipline Planner Password",
    RECOVER_ACCOUNT: "Your Account Has Been Recovered",
    DELETE_ACCOUNT_SCHEDULED: "Your Account Deletion is Scheduled",
} as const;

// --- MODELS ---
export const MODEL_NAMES = {
	USER: 'User',
	DISCIPLINE: 'Discipline',
	TASK: 'Task',
	DAY: 'Day',
} as const;
export const GENDER_OPTIONS = ["Male", "Female"] as const;
export const DEFAULT_AVATAR = "https://placehold.co/100x100/E2E8F0/4A5568?text=AD";






















// Mail Type
const MAIL_TYPES = {
	welcome: "WELCOME",
	verify: "VERIFY",
	reset: "RESET",
	daily_remainder: "DAILY_REMAINDER",
	inactive_user_reengagement: "INACTIVE_USER_REENGAGEMENT",
	streak_milestone: "STREAK_MILESTONE",
	weekly_progress: "WEEKLY_PROGRESS",
	delete: "DELETE",
	recover: "RECOVER",
};

// Mail Title
const MAIL_TITLES = {
	verify: "Verify Your Email",
	welcome: "Welcome To Discipline Planner",
	reset: "Reset Your Password",
	delete: "DELETE",
	recover: "RECOVER",
};

// User model data hide from user
const USER_HIDE_FIELDS = "-password -refreshToken -isVerified -verifyEmailToken -resetPasswordToken -resetPasswordExpires -isDeleted -deletedAt -deleteAccountToken -isDeactivated";

// Cookies options
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: false,	// true for production
};

// export {
// 	DB_NAME,
// 	MODEL_NAME,
// 	JWT_EXPIRY,
// 	DISCIPLINE_STATUS_ACTIVE,
// 	DISCIPLINE_STATUS_COMPLETED,
// 	DISCIPLINE_STATUS_FAILED,
// 	DISCIPLINE_STATUS_UPCOMING,
// 	DISCIPLINE_STATUS_UNKNOWN,
// 	MAIL_TYPES,
// 	USER_HIDE_FIELDS,
// 	MAIL_TITLES,
// 	COOKIE_OPTIONS,
// };