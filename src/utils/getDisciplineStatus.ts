import { DISCIPLINE_STATUS } from "@/constant";

const normalizeDate = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

type StoredDisciplineStatus = 
	| typeof DISCIPLINE_STATUS.ACTIVE
	| typeof DISCIPLINE_STATUS.COMPLETED
	| typeof DISCIPLINE_STATUS.FAILED;

type ComputedDisciplineStatus = 
	StoredDisciplineStatus 
	| typeof DISCIPLINE_STATUS.UPCOMING
	| typeof DISCIPLINE_STATUS.UNKNOWN;

interface Discipline {
	startDate: string | Date;
	endDate: string | Date;
	status: StoredDisciplineStatus;
}

const getDisciplineState = ({ startDate, endDate, status }: Discipline): ComputedDisciplineStatus => {

	const now = normalizeDate(new Date());
  	const start = normalizeDate(new Date(startDate));
  	const end = normalizeDate(new Date(endDate));

	if(status === DISCIPLINE_STATUS.COMPLETED)	return DISCIPLINE_STATUS.COMPLETED;
	if(status === DISCIPLINE_STATUS.FAILED)	return DISCIPLINE_STATUS.FAILED;

	if(start > now)	return DISCIPLINE_STATUS.UPCOMING;

	if(start <= now && end >= now)	return DISCIPLINE_STATUS.ACTIVE;

	// if(end < now && status === DISCIPLINE_STATUS.ACTIVE)	return DISCIPLINE_STATUS.FAILED;

  	return DISCIPLINE_STATUS.UNKNOWN;
};

export { getDisciplineState };