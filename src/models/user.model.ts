import { Schema, model, models } from "mongoose";
import { UserDocument, UserDocumentMethods, UserModel } from "./user.types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema<UserDocument & UserDocumentMethods>({
	username: {
		type: String,
		required: [true, "Username is required"],
		unique: [true, "Username should be unique"],
		lowercase: true,
		trim: true,
		index: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: [true, "Email should be unique"],
		lowercase: true,
		trim: true,
		index: true,
	},
	fullname: {
		type: String,
		required: [true, "Fullname is required"],
	},
	avatar: {
		type: String,
		required: true,
	},
	dateOfBirth: {
		type: Date,
	},
	gender: {
		type: String,
		enum: ["Male", "Female"],
		required: [true, "Gender is required"],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
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
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	deletedAt: {
		type: Date,
	},
	deleteAccountToken: {
		type: String,
	},
	isDeactivated: {
		type: Boolean,
		default: false,
	},
},
	{ timestamps: true }
);


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


const User = (models.User as UserModel) || model<UserDocument & UserDocumentMethods, UserModel>('User', userSchema);

export default User;