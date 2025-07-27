export interface CreateCalendarEntry {
  name: string;
  date: Date;
  notes: string | undefined;
  done: boolean | undefined;
  fk_routine_id: number | undefined;
  assignedUsers: number[] | undefined;
}
