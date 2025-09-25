import { Document, Model, Types } from "mongoose";

export interface IUser {
	_id: Types.ObjectId;
	username: string;
	email: string;
	fullname: string;
	avatar: string;
	dateOfBirth: Date;	// (optional) store when user want
	gender: string;
	password: string;
	refreshToken: string;	// (optional) store when user login, and delete when user account is deactivated
	isVerified: boolean;
	verifyEmailToken: string;	// (optional) store when user verify email, and delete when user verified
	resetPasswordToken: string;	// (optional) store when user request reset password, and delete when password is reset
	resetPasswordExpires: Date;	// (optional) store when user request reset password, and delete when password is reset
	isDeleted: boolean;	// (optional) store when user request delete account, and delete after user recovered account
	deletedAt: Date;	// (optional) store when user request delete account, and delete after user recovered account
	deleteAccountToken: string;	// (optional) store when user request delete account, and delete after user recovered account or deactivate account
	isDeactivated: boolean;	// (optional) store when user cannot recovered account, and delete when admin recovered user's account
}

export type UserDocument = Document<unknown, Record<string, never>, IUser> & IUser;

export interface UserDocumentMethods {
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): string;
	generateRefreshToken(): string;
}

export interface UserModel extends Model<UserDocument & UserDocumentMethods> {}