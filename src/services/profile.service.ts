import axios from "axios";
import { PROFILE_ROUTES } from "@/constant";

// --- GET PROFILE ---
type UserData = {
    username: string;
    fullname: string;
    avatar: string;
};

export const getProfile = async (): Promise<UserData> => {

	const response = await axios.get(PROFILE_ROUTES.GET_PROFILE);
	return response.data.data;
};

// --- UPDATE AVATAR ---
export const updateAvatar = async (avatarFile: File): Promise<UserData> => {

	const formData = new FormData();
	formData.append("avatar", avatarFile);

	const response = await axios.patch(PROFILE_ROUTES.UPDATE_AVATAR, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data.data;
};

// --- GET PROFILE DETAILS ---
type UserDetails = {
    fullname: string;
    dateOfBirth: string | Date;
    gender: string;
};

type UserProfile = UserDetails & {
    username: string;
    avatar: string;
};

export const getProfileDetails = async (): Promise<UserProfile> => {

	const response = await axios.get(PROFILE_ROUTES.GET_PROFILE_DETAILS);
	return response.data.data;
};

// --- UPDATE PROFILE ---
export const updateProfileDetails = async (details: UserDetails) => {

	const response = await axios.patch(PROFILE_ROUTES.UPDATE_PROFILE_DETAILS, details);
	return response.data;
};

// --- CHANGE PASSWORD ---
type PasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export const changePassword = async (passwords: PasswordData) => {

	const response = await axios.patch(PROFILE_ROUTES.CHANGE_PASSWORD, passwords);
	return response.data;
};

// --- DELETE ACCOUNT ---
export const deleteAccount = async () => {

	const response = await axios.delete(PROFILE_ROUTES.DELETE_ACCOUNT);
	return response.data;
};

// --- RECOVER ACCOUNT ---
export const recoverAccount = async (token: string) => {

	const response = await axios.post(PROFILE_ROUTES.RECOVER_ACCOUNT, { token });
	return response.data;
};

// --- GET AVATAR FOR SIDEBAR ---
type UserDataForNav = {
    fullname: string;
    avatar: string;
};

export const getProfileForNav = async (): Promise<UserDataForNav> => {
    
	const response = await axios.get(PROFILE_ROUTES.GET_PROFILE);
    const { fullname, avatar } = response.data.data;
    return { fullname, avatar };
};