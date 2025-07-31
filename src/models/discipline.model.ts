import { Schema, model, models } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IDiscipline, DisciplineModel, DisciplineDocument } from "./discipline.types";
import { DISCIPLINE_STATUS, MODEL_NAMES } from "@/constant";
import Task from "./task.model";
import Day from "./day.model";

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


disciplineSchema.plugin(aggregatePaginate);


disciplineSchema.pre<DisciplineDocument>('deleteOne', { document: true, query: false }, async function (next) {

	console.log(`Cascading delete for discipline: ${this._id}`);
	try {

		await Task.deleteMany({ discipline: this._id });

		await Day.deleteMany({ discipline: this._id });

		next();
	} catch(error: any) {
		next(error);
	}
});


const Discipline = (models.Discipline as DisciplineModel) || model<IDiscipline, DisciplineModel>(MODEL_NAMES.DISCIPLINE, disciplineSchema);

export default Discipline;