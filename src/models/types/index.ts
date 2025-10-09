import { IUser, UserDocument, UserDocumentMethods, UserModel } from "./user.types";
import { IDiscipline, DisciplineDocument, DisciplineModel } from "./discipline.types";
import { ITask, TaskDocument, TaskModel } from "./task.types";
import { ITaskState, IDay, DayDocument, DayModel } from "./day.types";
import { IContactMessage, ContactMessageDocument, ContactMessageModel } from "./contactmessage.types";

export type {
	// user
	IUser,
	UserDocument,
	UserDocumentMethods,
	UserModel,

	// discipline
	IDiscipline,
	DisciplineDocument,
	DisciplineModel,

	// task
	ITask,
	TaskDocument,
	TaskModel,

	// day
	ITaskState,
	IDay,
	DayDocument,
	DayModel,

	// contact message
	IContactMessage,
	ContactMessageDocument,
	ContactMessageModel,
};