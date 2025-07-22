import { Schema, model, models } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ITask, TaskModel } from "./task.types";

const taskSchema = new Schema<ITask>({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	description: {
		type: String,
	},
	priority: {
		type: Number,
		required: [true, "Priority is required"],
	},
	discipline: {
		type: Schema.Types.ObjectId,
		ref: 'Discipline',
		required: [true, "Task should be belongs to one discipline"],
		index: true,
	},
},
	{ timestamps: true }
);

taskSchema.plugin(aggregatePaginate);

const Task = (models.Task as TaskModel) || model<ITask, TaskModel>('Task', taskSchema);

export default Task;