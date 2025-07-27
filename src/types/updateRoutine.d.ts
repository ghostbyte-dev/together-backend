export interface UpdateRoutine {
  id: number;
  name?: string;
  startDate?: Date;
  active?: boolean;
  interval?: number;
  assignedUsers?: number[];
}
