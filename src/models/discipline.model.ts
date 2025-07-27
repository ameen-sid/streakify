import { Schema, model, models } from "mongoose";
import { IDiscipline, DisciplineModel } from "./discipline.types";
import { DISCIPLINE_STATUS, MODEL_NAMES } from "@/constant";

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
		ref: MODEL_NAMES.USER,
		required: [true, "Owner is required"],
		index: true,
	},
	status: {
		type: String,
		default: DISCIPLINE_STATUS.ACTIVE,
		enum: [DISCIPLINE_STATUS.ACTIVE, DISCIPLINE_STATUS.COMPLETED, DISCIPLINE_STATUS.FAILED],
	},
	currentStreak: {
        type: Number,
        default: 0,
    },
    longestStreak: {
        type: Number,
        default: 0,
    },
},
	{ timestamps: true }
);

const Discipline = (models.Discipline as DisciplineModel) || model<IDiscipline, DisciplineModel>(MODEL_NAMES.DISCIPLINE, disciplineSchema);

export default Discipline;