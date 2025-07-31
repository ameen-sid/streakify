import { Document, Model, Types } from "mongoose";
import type { AggregatePaginateModel } from "mongoose";

export interface IDiscipline {
	_id: Types.ObjectId;
	name: string;
	description: string;	// (optional) store when user want to add description
	startDate: Date;
	endDate: Date;
	owner: Types.ObjectId;
	status: string;
	currentStreak: number;
	longestStreak: number;
}

export type DisciplineDocument = Document<unknown, Record<string, never>, IDiscipline> & IDiscipline;

export interface DisciplineModel extends AggregatePaginateModel<DisciplineDocument> {}