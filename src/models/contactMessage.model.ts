import { Schema, model, models } from "mongoose";
import { MODEL_NAMES, CONTACT_MESSAGE_REASONS } from "@/constant";
import { User, Discipline, Task, Day } from "@/models";
import { ContactMessageDocument, ContactMessageModel } from "@/models/types";

const contactMessageSchema = new Schema<ContactMessageDocument>({
	fullname: {
		type: String,
		required: [true, "Full name is required"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		lowercase: true,
		trim: true,
		index: true,
	},
	reason: {
		type: String,
		enum: CONTACT_MESSAGE_REASONS,
		required: [true, "Reason is required"],
	},
	message: {
		type: String,
		required: [true, "Message is required"],
	}
},
	{ timestamps: true }
);

const ContactMessage = (models.ContactMessage as ContactMessageModel) || model<ContactMessageDocument, ContactMessageModel>(MODEL_NAMES.CONTACT_MESSAGE, contactMessageSchema);

export default ContactMessage;