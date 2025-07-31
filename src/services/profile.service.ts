import axios from "axios";
import { HEADERS, PROFILE_ROUTES } from "@/constant";

// --- GET PROFILE ---
type UserData = {
    username: string;
	email: string;
    fullname: string;
    avatar: string;
	dob: string | Date;
	gender: string;
};

type ProfilePageDate = {
	username: string;
	fullname: string;
	avatar: string;
};

export const getProfile = async (): Promise<ProfilePageDate> => {

	const response = await axios.get(
		PROFILE_ROUTES.GET_PROFILE,
		{ headers: HEADERS }
	);
	
	const { username, fullname, avatar } = response.data.data;
	return { username, fullname, avatar };
};

// --- GET EDIT PROFILE DETAILS ---
type EditProfilePageData = {
    fullname: string;
    dateOfBirth: string | Date;
    gender: string;
};

export const getProfileDetails = async (): Promise<EditProfilePageData> => {

	const response = await axios.get(
		PROFILE_ROUTES.GET_PROFILE,
		{ headers: HEADERS }
	);

	const { fullname, dateOfBirth, gender } = response.data.data;
	return { fullname, dateOfBirth, gender };
};

// --- UPDATE PROFILE ---
export const updateProfileDetails = async (details: EditProfilePageData) => {

	const response = await axios.patch(
		PROFILE_ROUTES.UPDATE_PROFILE_DETAILS, 
		details,
		{ headers: HEADERS }
	);
	return response.data;
};

// --- UPDATE AVATAR ---
export const updateAvatar = async (avatarFile: File): Promise<UserData> => {

	const formData = new FormData();
	formData.append("avatar", avatarFile);

	const response = await axios.patch(
		PROFILE_ROUTES.UPDATE_AVATAR, 
		formData, 
		{
			headers: {
				'Content-Type': 'multipart/form-data',
				'Accept': 'application/json'
			},
		}
	);
	return response.data.data;
};

// --- CHANGE PASSWORD ---
type PasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export const changePassword = async (passwords: PasswordData) => {

	const { confirmPassword, ...dataToSend } = passwords;

	const response = await axios.patch(
		PROFILE_ROUTES.CHANGE_PASSWORD, 
		dataToSend,
		{ headers: HEADERS }
	);
	return response.data;
};

// --- DELETE ACCOUNT ---
export const deleteAccount = async () => {

	const response = await axios.delete(PROFILE_ROUTES.DELETE_ACCOUNT);
	return response.data;
};

// --- RECOVER ACCOUNT ---
export const recoverAccount = async (token: string) => {

	const response = await axios.post(
		PROFILE_ROUTES.RECOVER_ACCOUNT, 
		{ token },
		{ headers: HEADERS }
	);
	return response.data;
};

// --- GET AVATAR FOR SIDEBAR ---
type SideBarData = {
    fullname: string;
    avatar: string;
};

export const getProfileForNav = async (): Promise<SideBarData> => {
    
	const response = await axios.get(
		PROFILE_ROUTES.GET_PROFILE,
		{ headers: HEADERS }
	);

    const { fullname, avatar } = response.data.data;
    return { fullname, avatar };
};