import { Document, Model, Types } from "mongoose";

export interface IOTP {
	_id: Types.ObjectId;
	email: string;
	otp: string;
	createdAt: Date;
}

export type OTPDocument = Document<unknown, {}, IOTP> & IOTP;

export interface OTPModel extends Model<OTPDocument> {}