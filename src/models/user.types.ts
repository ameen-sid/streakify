import { Document, Model, Types } from "mongoose";

export interface IUser {
	_id: Types.ObjectId;
	username: string;
	email: string;
	fullname: string;
	avatar: string;
	dateOfBirth: Date;
	gender: string;
	password: string;
	refreshToken: string;
	isVerified: boolean;
	verifyEmailToken: string;
	resetPasswordToken: string;
	resetPasswordExpires: Date | null;
	isDeleted: boolean;
	deletedAt: Date | null;
	deleteAccountToken: string | null;
	isDeactivated: boolean;
}

export type UserDocument = Document<unknown, {}, IUser> & IUser;

export interface UserDocumentMethods {
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): string;
	generateRefreshToken(): string;
}

export interface UserModel extends Model<UserDocument & UserDocumentMethods> {}