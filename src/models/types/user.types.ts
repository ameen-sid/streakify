import { Document, Model, Types } from "mongoose";

export interface IUser {
	_id: Types.ObjectId;		// created by mongodb

	username: string;			// mandatory
	email: string;				// mandatory
	password: string;			// (optional) store when user signup with creadentials

	role: string;				// default

	authProvider: string;		// default
	providerId: string;			// (optional) store when user signup with OAuth

	fullname: string;			// (optional) store when user want
	avatar: string;				// default + generate in controller
	dateOfBirth: Date;			// (optional) store when user want
	gender: string;				// (optional) store when user want
	socialLinks: {				// (optional) store when user want
		github?: string;
		linkedIn?: string;
		twitter?: string;
	}

	refreshToken: string;		// (optional) store when user login, and delete when user account is deactivated

	isVerified: boolean;		// default 
	verifyEmailToken: string;	// (optional) store when user verify email, and delete when user verified
	emailVerifiedAt: Date;		// (optional) store when user verified email

	resetPasswordToken: string;	// (optional) store when user request reset password, and delete when password is reset
	resetPasswordExpires: Date;	// (optional) store when user request reset password, and delete when password is reset

	isDeleted: boolean;			// (optional) store when user request delete account, and delete after user recovered account
	deletedAt: Date;			// (optional) store when user request delete account, and delete after user recovered account
	deleteAccountToken: string;	// (optional) store when user request delete account, and delete after user recovered account or deactivate account
	isDeactivated: boolean;		// (optional) store when user cannot recovered account, and delete when admin recovered user's account

	lastLoginAt: Date;			// (optional) store when user create account, and update when user login
	loginCount: Number;			// (optional) store when user create account, and update when user login
	lastActiveAt: Date;			// (optional) store when user create account, and update when user login
	ipAddress: string;			// (optional) store when user create account, and update when user login
	userAgent: string;			// (optional) store when user create account
	logoutAt: Date;				// (optional) store when user logout, and update when user logout
	lastPasswordChangedAt: Date;// (optional) store when user change password

	settings: {					// default
		notifications: {
			streakAlert: boolean;
			newFeatureAlert: boolean;
		},
		preferences: {
			timeZone: string;
		},
		privacy: {
			isProfilePublic: boolean;
			streakLeaderboardVisibility: boolean;
		},
	}
}

export type UserDocument = Document<unknown, Record<string, never>, IUser> & IUser;

export interface UserDocumentMethods {
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): string;
	generateRefreshToken(): string;
}

export interface UserModel extends Model<UserDocument & UserDocumentMethods> {}