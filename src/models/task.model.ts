import { Schema, model, models } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ITask, TaskModel } from "@/models/types";
import { MODEL_NAMES } from "@/constant";
import { User, Discipline, Day } from "@/models";
// import "@/models/user.model";
// import "@/models/discipline.model";
// import "@/models/task.model";
// import "@/models/day.model";

const taskSchema = new Schema<ITask>({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	description: {
		type: String,
		required: [true, "Description is required"],
	},
	priority: {
		type: Number,
		required: [true, "Priority is required"],
	},
	discipline: {
		type: Schema.Types.ObjectId,
		ref: MODEL_NAMES.DISCIPLINE,
		required: [true, "Task should be belongs to one discipline"],
		index: true,
	},
},
	{ timestamps: true }
);

taskSchema.plugin(aggregatePaginate);

const Task = (models.Task as TaskModel) || model<ITask, TaskModel>(MODEL_NAMES.TASK, taskSchema);

export default Task;