import { signUpUser, verifyEmail, loginUser, logoutUser, sendResetPasswordToken, resetPassword, refreshAccessToken } from "./auth.service";
import { getProfile, getProfileDetails, updateProfileDetails, updateAvatar, changePassword, deleteAccount, recoverAccount, getProfileForNav } from "./profile.service";
import { getDisciplines, createDiscipline, getDisciplineById, updateDiscipline, deleteDiscipline } from "./discipline.service";
import { getTasksForDiscipline, createTask, getTaskById, updateTask, deleteTask } from "./task.service";
import { getDashboardData, getHighlightsForMonth } from "./dashboard.service";
import { getDailyLog, saveHighlight, updateTaskStatus, getLogByDate } from "./dailylog.service";
import { submitContactForm } from "./contact.service";

export {
	// auth
	signUpUser,
	verifyEmail,
	loginUser,
	logoutUser,
	sendResetPasswordToken,
	resetPassword,
	refreshAccessToken,

	// profile
	getProfile,
	getProfileDetails,
	updateProfileDetails,
	updateAvatar,
	changePassword,
	deleteAccount,
	recoverAccount,
	getProfileForNav,

	// discipline
	getDisciplines,
	createDiscipline,
	getDisciplineById,
	updateDiscipline,
	deleteDiscipline,

	// task
	getTasksForDiscipline,
	createTask,
	getTaskById,
	updateTask,
	deleteTask,

	// dashboard
	getDashboardData,
	getHighlightsForMonth,

	// dailylog
	getDailyLog,
	saveHighlight,
	updateTaskStatus,
	getLogByDate,

	// contact form
	submitContactForm,
};