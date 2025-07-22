import { Schema, model, models } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IDay, DayModel, ITaskState } from "./day.types";

const taskStateSchema = new Schema<ITaskState>({
	task: {
		type: Schema.Types.ObjectId,
		ref: 'Task',
		required: [true, "Task is required"],
	},
	isCompleted: {
		type: Boolean,
		default: false,
		required: [true, "isCompleted is required"],
	},
});

const daySchema = new Schema<IDay>({
	date: {
		type: Date,
		required: [true, "Date is required"],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, "Day should be belongs to user"],
	},
	discipline: {
		type: Schema.Types.ObjectId,
		ref: 'Discipline',
		required: [true, "Day should be belongs to discipline"],
	},
	taskState: [
		taskStateSchema
	],
	highlight: {
		type: String,
		required: [true, "Short Description is required"],
	},
},
	{ timestamps: true },
);

daySchema.plugin(aggregatePaginate);

const Day = (models.Day as DayModel) || model<IDay, DayModel>('Day', daySchema);

export default Day;