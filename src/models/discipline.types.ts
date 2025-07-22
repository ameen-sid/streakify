import { Document, Model, Types } from "mongoose";

export interface IDiscipline {
	_id: Types.ObjectId;
	name: string;
	description: string;
	startDate: Date;
	endDate: Date;
	owner: Types.ObjectId;
}

export type DisciplineDocument = Document<unknown, {}, IDiscipline> & IDiscipline;

export interface DisciplineModel extends Model<DisciplineDocument> {}