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
	resetPasswordToken: string;
	resetPasswordExpires: Date;
	isDeleted: boolean;
	deletedAt: Date;
	deleteAccountToken: string;
	isDeactivated: boolean;
}

export type UserDocument = Document<unknown, {}, IUser> & IUser;

export interface UserDocumentMethods {
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): string;
	generateRefreshToken(): string;
}

export interface UserModel extends Model<UserDocument & UserDocumentMethods> {}