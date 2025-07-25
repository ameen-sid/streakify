import { Document, Types } from "mongoose";
import type { AggregatePaginateModel } from "mongoose";

export interface ITaskState {
	_id: Types.ObjectId;
	task: Types.ObjectId;
	isCompleted: boolean;
}

export interface IDay {
	_id: Types.ObjectId;
	date: Date,
	user: Types.ObjectId;
	discipline: Types.ObjectId;
	taskState: ITaskState[];
	highlight: String;
}

export type DayDocument = Document<unknown, {}, IDay> & IDay;

export interface DayModel extends AggregatePaginateModel<DayDocument> {}