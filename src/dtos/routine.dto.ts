import { UserDto } from './user.dto';

export class RoutineDto {
  public id: number;
  public name: string;
  public startDate: Date;
  public active: boolean = true;
  public interval: number;
  public communityId: number;
  public assignedUsers?: UserDto[];

  constructor(routine: any) {
    this.id = routine.id;
    this.name = routine.name;
    this.startDate = routine.startDate;
    this.active = routine.active;
    this.interval = routine.interval;
    this.communityId = routine.communityId;
    if (routine.routine_user) {
      this.assignedUsers = routine.routine_user.map(
        (routine_user: any) => new UserDto(routine_user.user),
      );
    }
  }
}
