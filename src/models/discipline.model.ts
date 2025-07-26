import { Schema, model, models } from "mongoose";
import { IDiscipline, DisciplineModel } from "./discipline.types";

const disciplineSchema = new Schema<IDiscipline>({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	description: {
		type: String,
	},
	startDate: {
		type: Date,
		required: [true, "Start date is required"],
	},
	endDate: {
		type: Date,
		required: [true, "End date is required"],
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, "Owner is required"],
		unique: [true, "Owner should have one discipline only"],
		index: true,
	},
	status: {
		type: String,
		default: "Active",
		enum: ["Active", "Completed", "Failed"],
	},
},
	{ timestamps: true }
);

const Discipline = (models.Discipline as DisciplineModel) || model<IDiscipline, DisciplineModel>('Discipline', disciplineSchema);

export default Discipline;