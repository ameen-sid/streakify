import { UserDocument, IUser } from "@/models/user.types";

// return type excludes sensitive fields
type SafeUser = Omit<IUser, 
	| "password"
	| "refreshToken"
	| "resetPasswordToken"
	| "resetPasswordExpires"
	| "isDeleted"
	| "deletedAt"
	| "deleteAccountToken"
	| "isDeactivated"
>;

const sanitizeUser = (user: UserDocument): SafeUser => {

	const {
		password,
		refreshToken,
		resetPasswordToken,
		resetPasswordExpires,
		isDeleted,
		deletedAt,
		deleteAccountToken,
		isDeactivated,
		...safeUser
	} = user.toObject();
	return safeUser;
};

export { sanitizeUser };