// Datebase name
const DB_NAME = "DisciplinePlanner";

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
};

// User model data hide from user
const USER_HIDE_FIELDS = "-password -refreshToken -isVerified -verifyEmailToken -resetPasswordToken -resetPasswordExpires -isDeleted -deletedAt -deleteAccountToken -isDeactivated";

// Cookies options
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: false,	// true for production
};

export {
	DB_NAME,
	MAIL_TYPES,
	USER_HIDE_FIELDS,
	MAIL_TITLES,
	COOKIE_OPTIONS,
};