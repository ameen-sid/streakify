import { Schema, model, models } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IDay, DayModel, ITaskState } from "./day.types";
import { MODEL_NAMES } from "@/constant";
import "@/models/user.model";
import "@/models/discipline.model";
import "@/models/task.model";

const taskStateSchema = new Schema<ITaskState>({
	task: {
		type: Schema.Types.ObjectId,
		ref: MODEL_NAMES.TASK,
		required: [true, "Task is required"],
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
});

const daySchema = new Schema<IDay>({
	date: {
		type: Date,
		required: [true, "Date is required"],
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: MODEL_NAMES.USER,
		required: [true, "Day should be belongs to user"],
		index: true,
	},
	discipline: {
		type: Schema.Types.ObjectId,
		ref: MODEL_NAMES.DISCIPLINE,
		required: [true, "Day should be belongs to discipline"],
	},
	taskState: [
		taskStateSchema
	],
	highlight: {
		type: String,
	},
},
	{ timestamps: true },
);

daySchema.plugin(aggregatePaginate);

const Day = (models.Day as DayModel) || model<IDay, DayModel>(MODEL_NAMES.DAY, daySchema);

export default Day;