import { UserDocument, IUser } from "@/models/types";
import { SENSITIVE_USER_FIELDS } from "@/constant";

type SensitiveField = typeof SENSITIVE_USER_FIELDS[number];

// return type excludes sensitive fields
export type SafeUser = Omit<IUser, SensitiveField | "_id"> & { id: string };

const sanitizeUser = (user: UserDocument): SafeUser => {

	const {
		password,
		refreshToken,
		verifyEmailToken,
		resetPasswordToken,
		resetPasswordExpires,
		isDeleted,
		deletedAt,
		deleteAccountToken,
		isDeactivated,
		lastLoginAt,
		loginCount,
		lastActiveAt,
		ipAddress,
		userAgent,
		logoutAt,
		lastPasswordChangedAt,
		settings,
		_id,
		...safeUser
	} = user.toObject();

	return {
		...safeUser,
		id: user._id.toString(),
	};
};

export { sanitizeUser };