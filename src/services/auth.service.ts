import axios from "axios";
import { AUTH_ROUTES, HEADERS } from "@/constant";

// --- SIGN UP ---
type UserSignUpData = {
    username: string;
    email: string;
    fullname: string;
    gender: string;
    password: string;
	confirmPassword: string;
};

export const signUpUser = async (userData: UserSignUpData) => {

	const { confirmPassword, ...dataToSend } = userData;

	const response = await axios.post(
		AUTH_ROUTES.SIGN_UP, 
		dataToSend, 
		{ headers: HEADERS }
	);
	return response.data;
};

// --- VERIFY EMAIL ---
export const verifyEmail = async (token: string) => {

	const response = await axios.post(
		AUTH_ROUTES.VERIFY_EMAIL, 
		{ token },
		{ headers: HEADERS }
	);
	return response.data;
};

// --- LOGIN ---
type Credentials = {
    email: string;
    password: string;
};

export const loginUser = async (credentials: Credentials) => {

	const response = await axios.post(
		AUTH_ROUTES.LOGIN, 
		credentials,
		{ headers: HEADERS }
	);
	return response.data;
};

// --- LOGOUT ---
export const logoutUser = async () => {

	const response = await axios.post(AUTH_ROUTES.LOGOUT);
	return response.data;
};

// --- RESET PASSWORD REQUEST ---
export const sendResetPasswordToken = async (email: string) => {

	const response = await axios.post(
		AUTH_ROUTES.FORGOT_PASSWORD, 
		{ email },
		{ headers: HEADERS }
	);
	return response.data;
};

// --- RESET PASSWORD ---
type ResetPasswordData = {
    newPassword: string;
    confirmPassword: string;
    token: string;
};

export const resetPassword = async (data: ResetPasswordData) => {

	const { confirmPassword, ...dataToSend } = data;

	const response = await axios.patch(
		AUTH_ROUTES.RESET_PASSWORD, 
		dataToSend,
		{ headers: HEADERS }
	);
	return response.data;
};

// --- REFRESH TOKEN ---
export const refreshAccessToken = async () => {

	const response = await axios.post(AUTH_ROUTES.REFRESH_TOKEN);
	return response.data;
};