export interface CreateRoutine {
  name: string;
  startDate: Date;
  interval: number;
  assignedUsers: number[] | undefined;
}
