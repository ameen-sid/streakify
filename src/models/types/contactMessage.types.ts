import { Document, Model, Types } from "mongoose";

export interface IContactMessage {
	_id: Types.ObjectId;
	fullname: string;
	email: string;
	reason: string;
	message: string;
}

export type ContactMessageDocument = Document<unknown, Record<string, never>, IContactMessage> & IContactMessage;

export interface ContactMessageModel extends Model<ContactMessageDocument> {}