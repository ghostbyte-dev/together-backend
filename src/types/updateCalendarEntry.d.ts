export interface UpdateCalendarEntry {
  id: number;
  name?: string;
  date?: Date;
  notes?: string;
  done?: boolean;
  fk_routine_id?: number;
  assignedUsers?: number[];
}
