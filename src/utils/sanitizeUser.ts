import { UserDocument, IUser } from "@/models/user.types";
import { SENSITIVE_USER_FIELDS } from "@/constant";

type SensitiveField = typeof SENSITIVE_USER_FIELDS[number];

// return type excludes sensitive fields
type SafeUser = Omit<IUser, SensitiveField>;

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
		...safeUser
	} = user.toObject();
	return safeUser;
};

export { sanitizeUser };