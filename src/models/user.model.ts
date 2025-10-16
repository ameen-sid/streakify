import { Schema, model, models } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserDocument, UserDocumentMethods, UserModel } from "@/models/types";
import { MODEL_NAMES, ROLE_OPTIONS, AUTH_PROVIDER_OPTIONS, GENDER_OPTIONS, DEFAULT_AVATAR } from "@/constant";
import { Discipline, Task, Day } from "@/models";
// import "@/models/user.model";
// import "@/models/discipline.model";
// import "@/models/task.model";
// import "@/models/day.model";

const userSchema = new Schema<UserDocument & UserDocumentMethods>({
	username: {
		type: String,
		required: [true, "Username is required"],
		unique: true,
		lowercase: true,
		trim: true,
		index: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		lowercase: true,
		trim: true,
		index: true,
	},
	password: {
		type: String,
		required: function() {
			return !this.authProvider || this.authProvider === "credentials";
		},
		select: false,
	},

	role: {
		type: String,
		enum: ROLE_OPTIONS,
		default: "User",
	},

	authProvider: {
		type: String,
		enum: AUTH_PROVIDER_OPTIONS,
		default: "credentials",
		index: true,
	},
	providerId: {
		type: String,
		unique: false,
		sparse: true,
	},

	fullname: {
		type: String,
	},
	avatar: {
		type: String,
		default: DEFAULT_AVATAR,
	},
	dateOfBirth: {
		type: Date,
	},
	gender: {
		type: String,
		enum: GENDER_OPTIONS,
	},
	socialLinks: {
		type: Schema.Types.Mixed
	},

	refreshToken: {
		type: String,
	},

	isVerified: {
		type: Boolean,
		default: false,
	},
	verifyEmailToken: {
		type: String,
	},
	emailVerifiedAt: {
		type: Date,
	},

	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},

	isDeleted: {
		type: Boolean,
	},
	deletedAt: {
		type: Date,
	},
	deleteAccountToken: {
		type: String,
	},
	isDeactivated: {
		type: Boolean,
	},

	lastLoginAt: {
		type: Date,
	},
	loginCount: {
		type: Number,
		default: 0,
	},
	lastActiveAt: {
		type: Date,
	},
	ipAddress: {
		type: String,
	},
	userAgent: {
		type: String,
	},
	logoutAt: {
		type: Date,
	},
	lastPasswordChangedAt: {
		type: Date,
	},

	settings: {
		notifications: {
			streakAlert: {
				type: Boolean,
				default: true,
			},
			newFeatureAlert: {
				type: Boolean,
				default: true,
			},
		},
		preferences: {
			timeZone: {
				type: String,
				default: "UTC",
			},
		},
		privacy: {
			isProfilePublic: {
				type: Boolean,
				default: true,
			},
			streakLeaderboardVisibility: {
				type: Boolean,
				default: true,
			},
		},
	},
},
	{ timestamps: true }
);


userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ authProvider: 1 });
userSchema.index({ lastLoginAt: -1 });


userSchema.pre<UserDocument>('save', async function (next) {

	if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (this: UserDocument, password: string): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: UserDocument): string {
	return jwt.sign(
		{ 
			_id: this._id, 
			username: this.username, 
			email: this.email 
		},
		process.env.ACCESS_TOKEN_SECRET!,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any }
	);
};

userSchema.methods.generateRefreshToken = function (this: UserDocument): string {
	return jwt.sign(
		{ _id: this._id },
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any }
	);
};


const User = (models.User as UserModel) || model<UserDocument & UserDocumentMethods, UserModel>(MODEL_NAMES.USER, userSchema);

export default User;