const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

type DisciplineStatus = 'Active' | 'Completed' | 'Failed';

interface Discipline {
	startDate: string;
	endDate: string;
	status: DisciplineStatus;
};

type ComputedDisciplineStatus = DisciplineStatus | 'Upcoming' | 'Unknown';

const getDisciplineState = ({ startDate, endDate, status }: Discipline): ComputedDisciplineStatus => {

	const now = normalizeDate(new Date());
  	const start = normalizeDate(new Date(startDate));
  	const end = normalizeDate(new Date(endDate));

  	if (status === 'Completed') return 'Completed';
  	else if (status === 'Failed') return 'Failed';
  	else if (start > now) return 'Upcoming';
  	else if (start <= now && end >= now) return 'Active';
  	else return 'Unknown';
};

export { getDisciplineState };