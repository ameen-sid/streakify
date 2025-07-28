import axios from "axios";
import { AUTH_ROUTES } from "@/constant";

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

	const response = await axios.post(AUTH_ROUTES.SIGN_UP, dataToSend);
	return response.data;
};

// --- VERIFY EMAIL TOKEN ---
export const verifyEmailToken = async (token: string) => {

	const response = await axios.post(AUTH_ROUTES.VERIFY_EMAIL, { token });
	return response.data;
};

// --- LOGIN ---
type Credentials = {
    email: string;
    password: string;
};

export const loginUser = async (credentials: Credentials) => {

	const response = await axios.post(AUTH_ROUTES.LOGIN, credentials);
	return response.data;
};

// --- RESET PASSWORD TOKEN ---
export const sendResetPasswordToken = async (email: string) => {

	const response = await axios.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
	return response.data;
};

// --- RESET PASSWORD ---
type ResetPasswordData = {
    newPassword: string;
    confirmPassword: string;
    token: string;
};

export const resetPassword = async (data: ResetPasswordData) => {

	const response = await axios.patch(AUTH_ROUTES.RESET_PASSWORD, data);
	return response.data;
};

// --- LOGOUT ---
export const logoutUser = async () => {

	const response = await axios.post(AUTH_ROUTES.LOGOUT);
	return response.data;
};