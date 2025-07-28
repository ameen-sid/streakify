import { ListTodo, History, Settings, LayoutDashboard, BarChart3, Star, UserCircle } from "lucide-react";

// ----- FRONTEND CONSTANTS -----
// ------------------------------

// --- APPLICATION ---
export const APP_NAME = "Discipline Planner";

// --- GEMINI AI ---
export const MODEL_NAME =  "gemini-1.5-flash-latest";

// --- DISCIPLINE STATUS ---
export const DISCIPLINE_STATUS = {
	ACTIVE: 'Active',
	COMPLETED: 'Completed',
	FAILED: 'Failed',
	UPCOMING: 'Upcoming',
	UNKNOWN: 'Unknown',
} as const;

// --- API ROUTES ---
export const API_BASE_URL = "/api/v1";

// --- AUTH ---
export const AUTH_ROUTES = {
	SIGN_UP: `${API_BASE_URL}/auth/sign-up`,
	VERIFY_EMAIL: `${API_BASE_URL}/auth/verify`,
	LOGIN: `${API_BASE_URL}/auth/login`,
	FORGOT_PASSWORD: `${API_BASE_URL}/auth/reset-password/token`,
	RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
	LOGOUT: `${API_BASE_URL}/auth/logout`,
} as const;

// --- PROFILE --- 
export const PROFILE_ROUTES = {
	GET_PROFILE: `${API_BASE_URL}/profile`,
	UPDATE_AVATAR: `${API_BASE_URL}/profile/avatar`,
	GET_PROFILE_DETAILS: `${API_BASE_URL}/profile/edit`,
	UPDATE_PROFILE_DETAILS: `${API_BASE_URL}/profile`,
	CHANGE_PASSWORD: `${API_BASE_URL}/profile/password`,
	DELETE_ACCOUNT: `${API_BASE_URL}/profile/account`,
	RECOVER_ACCOUNT: `${API_BASE_URL}/profile/account/recover`,
} as const;

// --- DISCIPLINE ---
export const DISCIPLINE_ROUTES = {
	GET_ALL: `${API_BASE_URL}/disciplines`,
	DELETE: (id: string) => `${API_BASE_URL}/disciplines/${id}`,
	CREATE: `${API_BASE_URL}/disciplines`,
	GET_BY_ID: (id: string) => `${API_BASE_URL}/disciplines/${id}`,
	UPDATE: (id: string) => `${API_BASE_URL}/disciplines/${id}`,
} as const;

// --- TASK ---
export const TASK_ROUTES = {
	GET_BY_DISCIPLINE: (disciplineId: string) => `${API_BASE_URL}/disciplines/${disciplineId}/tasks`,
    DELETE: (taskId: string) => `${API_BASE_URL}/tasks/${taskId}`,
	CREATE: (disciplineId: string) => `${API_BASE_URL}/disciplines/${disciplineId}/tasks`,
	GET_BY_ID: (taskId: string) => `${API_BASE_URL}/tasks/${taskId}`,
	UPDATE: (taskId: string) => `${API_BASE_URL}/tasks/${taskId}`,
} as const;

// --- DAILY LOG ROUTES ---
export const DAILYLOG_ROUTES = {
    GET_TODAY: `${API_BASE_URL}/dailylogs/today`,
    UPDATE_TASK: (taskId: string) => `${API_BASE_URL}/dailylogs/today/tasks/${taskId}`,
    SAVE_HIGHLIGHT: `${API_BASE_URL}/dailylogs/today/highlight`,
	GET_BY_DATE: (date: string) => `${API_BASE_URL}/dailylogs/by-date/${date}`,
};

// --- DASHBOARD ROUTES ---
export const DASHBOARD_ROUTES = {
    GET_HIGHLIGHTS: (month: string) => `${API_BASE_URL}/dashboard/highlights?month=${month}`, // Add this
	GET_SUMMARY: (month: string) => `${API_BASE_URL}/dashboard?month=${month}`
};

// --- NAVIGATION ---
export const APP_NAVIGATION_LINKS = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: "Today's Log", href: '/today', icon: ListTodo },
    { name: 'Disciplines', href: '/disciplines', icon: Settings },
    { name: 'Highlights', href: '/dashboard/highlights', icon: Star },
    { name: 'Past Logs', href: '/logs', icon: History },
    // { name: 'Grid View', href: '/dashboard/grid', icon: LayoutDashboard },
    // { name: 'Summary View', href: '/dashboard/summary', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: UserCircle },
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
] as const;

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

// COOKIES OPTIONS
export const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: false,	// true for production
};

// USER MODEL DATA FIELDS HIDE FROM USER
export const USER_HIDE_FIELDS = "-password -refreshToken -isVerified -verifyEmailToken -resetPasswordToken -resetPasswordExpires -isDeleted -deletedAt -deleteAccountToken -isDeactivated";

// -----------------------------
// ----- BACKEND CONSTANTS -----
