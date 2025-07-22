import { Document, Types } from "mongoose";
import type { AggregatePaginateModel } from "mongoose";

export interface ITask {
	_id: Types.ObjectId;
	name: string;
	description: string;
	priority: number;
	discipline: Types.ObjectId
}

export type TaskDocument = Document<unknown, {}, ITask> & ITask;

export interface TaskModel extends AggregatePaginateModel<TaskDocument> {}