import { ListTodo, History, Settings, LayoutDashboard, Star, UserCircle } from "lucide-react";
import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

// ----- FRONTEND CONSTANTS -----
// ------------------------------

// --- APPLICATION ---
export const APP_NAME = "Streakify";

// --- EMAIL USERNAME ---
export const EMAIL_USERNAME = "codehell7@gmail.com";
export const ADMIN_EMAIL = "ameensid7@outlook.com";

// --- GEMINI AI ---
export const MODEL_NAME = "gemini-2.5-flash-lite";

// --- DISCIPLINE STATUS ---
export const DISCIPLINE_STATUS = {
	ACTIVE: 'Active',
	COMPLETED: 'Completed',
	FAILED: 'Failed',
	UPCOMING: 'Upcoming',
	UNKNOWN: 'Unknown',
} as const;

// --- API HEADERS ---
export const HEADERS = {
	'Content-Type': 'application/json',
	'Accept': 'application/json'
};

// --- API ROUTES ---
export const API_BASE_URL = "/api/v1";
export const API_BASE_URL_V2 = "/api/v2";

// --- AUTH ---
export const AUTH_ROUTES = {
	SIGN_UP: `${API_BASE_URL_V2}/auth/signup`,
	RESEND_VERIFICATION_EMAIL: `${API_BASE_URL}/auth/resend-verification`,
	VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
	LOGIN: `${API_BASE_URL}/auth/login`,
	LOGOUT: `${API_BASE_URL}/auth/logout`,
	FORGOT_PASSWORD: `${API_BASE_URL}/auth/reset-password/request`,
	RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
	REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
} as const;

// --- PROFILE --- 
export const PROFILE_ROUTES = {
	GET_PROFILE: `${API_BASE_URL}/profile`,
	UPDATE_PROFILE_DETAILS: `${API_BASE_URL}/profile`,
	UPDATE_AVATAR: `${API_BASE_URL}/profile/avatar`,
	CHANGE_PASSWORD: `${API_BASE_URL}/profile/password`,
	DELETE_ACCOUNT: `${API_BASE_URL}/profile/account`,
	RECOVER_ACCOUNT: `${API_BASE_URL}/profile/account/recover`,
} as const;

// --- DISCIPLINE ---
export const DISCIPLINE_ROUTES = {
	GET_ALL: `${API_BASE_URL}/disciplines`,
	CREATE: `${API_BASE_URL}/disciplines`,
	GET_BY_ID: (id: string) => `${API_BASE_URL}/disciplines/${id}`,
	UPDATE: (id: string) => `${API_BASE_URL}/disciplines/${id}`,
	DELETE: (id: string) => `${API_BASE_URL}/disciplines/${id}`,
} as const;

// --- TASK ---
export const TASK_ROUTES = {
	GET_BY_DISCIPLINE: (disciplineId: string) => `${API_BASE_URL}/disciplines/${disciplineId}/tasks`,
	CREATE: (disciplineId: string) => `${API_BASE_URL}/disciplines/${disciplineId}/tasks`,
	GET_BY_ID: (taskId: string) => `${API_BASE_URL}/tasks/${taskId}`,
	UPDATE: (taskId: string) => `${API_BASE_URL}/tasks/${taskId}`,
    DELETE: (taskId: string) => `${API_BASE_URL}/tasks/${taskId}`,
} as const;

// --- DASHBOARD ROUTES ---
export const DASHBOARD_ROUTES = {
	GET_SUMMARY: (month: string) => `${API_BASE_URL}/dashboard?month=${month}`,
    GET_HIGHLIGHTS: (month: string) => `${API_BASE_URL}/dashboard/highlights?month=${month}`,
} as const;

// --- DAILY LOG ROUTES ---
export const DAILYLOG_ROUTES = {
    GET_TODAY: `${API_BASE_URL}/daily-logs/today`,
    SAVE_HIGHLIGHT: `${API_BASE_URL}/daily-logs/today/highlight`,
    UPDATE_TASK: (taskId: string) => `${API_BASE_URL}/daily-logs/today/tasks/${taskId}`,
	GET_BY_DATE: (date: string) => `${API_BASE_URL}/daily-logs/by-date/${date}`,
} as const;

// --- CRON JOB ROUTES ---
export const CRON_ROUTES = {
	ADD_DAY: `${API_BASE_URL}/cron/day`,
	UPDATE_DISCIPLINES_STATUS: `${API_BASE_URL}/cron/disciplines-status`,
	DELETE_SCHEDULED_USERS: `${API_BASE_URL}/cron/scheduled-users`,
	DAILY_REMINDERS: `${API_BASE_URL}/cron/daily-reminders`,
	INACTIVE_USERS: `${API_BASE_URL}/cron/inactive-users`,
	WEEKLY_PROGRESS_REPORT: `${API_BASE_URL}/cron/weekly-progress/report`,
} as const;

// --- CONTACT ROUTES ---
export const CONTACT_ROUTES = {
	SUBMIT_CONTACT_FORM: `${API_BASE_URL}/support/contact-messages`,
} as const;

// --- NAVIGATION ---
export const APP_NAVIGATION_LINKS = [
	{ name: "Today's Log", href: '/logs/today', icon: ListTodo },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Disciplines', href: '/disciplines', icon: Settings },
    { name: 'Highlights', href: '/dashboard/highlights', icon: Star },
    { name: 'Past Logs', href: (date: string) => `/logs/${date}`, icon: History },
    // { name: 'Grid View', href: '/dashboard/grid', icon: LayoutDashboard },
    // { name: 'Summary View', href: '/dashboard/summary', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
];

export const NAV_LINKS = [
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/contact-us', label: 'Contact Us' },
    { href: '/about-us', label: 'About Us' },
];

// ------------------------------
// ----- FRONTEND CONSTANTS -----



// ----- BACKEND CONSTANTS -----
// -----------------------------

// --- DATABASE ---
export const DB_NAME = "DisciplinePlanner";

// --- JWT ---
export const JWT_EXPIRY = "1d";

// --- CLOUDINARY ---
export const FOLDER_NAME = "User Avatars";
export const RESOURCE_TYPE = "auto";

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
	CONFLICT: 409,

	// Server Errors
	INTERNAL_SERVER_ERROR: 500,
} as const;
export const DEFAULT_SUCCESS_MESSAGE = "Success";

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
	"lastLoginAt",
	"loginCount",
	"lastActiveAt",
	"ipAddress",
	"userAgent",
	"logoutAt",
	"lastPasswordChangedAt",
	"settings",
] as const;

// --- EMAIL CONSTANTS ---
export const EMAIL_SUBJECTS = {
    WELCOME: `Welcome to ${APP_NAME}!`,
    VERIFY_EMAIL: "Please Verify Your Email Address",
    RESET_PASSWORD: `Reset Your ${APP_NAME} Password`,
    RECOVER_ACCOUNT: "Your Account Has Been Recovered",
    DELETE_ACCOUNT_SCHEDULED: "Your Account Deletion is Scheduled",
	DAILY_REMINDER: "A quick reminder to keep your streak going!",
	INACTIVE_USER: "Your discipline is waiting for you...",
	UPCOMING_DISCIPLINE_REMINDER: (disciplineName: string) => `Get Ready! Your Discipline '${disciplineName}' Starts Tomorrow`,
	WEEKLY_PROGRESS_REPORT: `Your Weekly Summary from ${APP_NAME}`,
	CONTACT_FORM_CONFIRMATION: `We've Received Your Message | ${APP_NAME}`,
	CONTACT_FORM_ADMIN_NOTIFICATION: (reason: string) => `New Contact Message (${reason}) from ${APP_NAME}`,
} as const;

// --- MODELS ---
export const MODEL_NAMES = {
	USER: 'User',
	DISCIPLINE: 'Discipline',
	TASK: 'Task',
	DAY: 'Day',
	CONTACT_MESSAGE: 'ContactMessage',
} as const;
export const ROLE_OPTIONS = ["Admin", "User"] as const;
export const AUTH_PROVIDER_OPTIONS = ["credentials", "google", "github"] as const;
export const GENDER_OPTIONS = ["Male", "Female"] as const;
export const DEFAULT_AVATAR = "https://placehold.co/100x100/E2E8F0/4A5568?text=AD";
export const CONTACT_MESSAGE_REASONS = ["General Inquiry", "Bug Report", "Feature Request", "Account Support"] as const;

// COOKIES OPTIONS
export const COOKIE_OPTIONS: Partial<ResponseCookie> = {
	httpOnly: true,
	secure: true,	// true for production
	sameSite: "strict"
};

// USER MODEL DATA FIELDS HIDE FROM USER
export const USER_HIDE_FIELDS = "-password -refreshToken -verifyEmailToken -resetPasswordToken -resetPasswordExpires -isDeleted -deletedAt -deleteAccountToken -isDeactivated";

// AVATAR UPLOAD ALLOWED FILE TYPES
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// AVATAR MAX SIZE
export const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// -----------------------------
// ----- BACKEND CONSTANTS -----