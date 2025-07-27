import { UserDto } from './user.dto';

export class CalendarEntryDto {
  public id: number;
  public name: string;
  public notes: string;
  public date: Date;
  public done: boolean;
  public fkRoutineId: number;
  public communityId: number;
  public assignedUsers?: UserDto[];

  constructor(calendarEntry: any) {
    this.id = calendarEntry.id;
    this.name = calendarEntry.name;
    this.notes = calendarEntry.notes;
    this.date = calendarEntry.date;
    this.done = calendarEntry.done;
    this.fkRoutineId = calendarEntry.fk_routine_id;
    this.communityId = calendarEntry.communityId;
    if (calendarEntry.calendar_entry_user) {
      this.assignedUsers = calendarEntry.calendar_entry_user.map(
        (calendar_entry_user: any) => new UserDto(calendar_entry_user.user),
      );
    }
  }
}
