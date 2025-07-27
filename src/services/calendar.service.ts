import { injectable, inject } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { CreateCalendarEntry } from '../types/createCalendarEntry';
import { CalendarEntryDto } from '../dtos/calendarEntry.dto';
import { UpdateCalendarEntry } from '../types/updateCalendarEntry';
import { routine } from '@prisma/client';

@injectable()
export class CalendarService {
  constructor(@inject(PrismaService) private prisma: PrismaService) {}

  async getById(calendarEntryId: number) {
    const calendarEntry = await this.prisma.calendar_entry.findUnique({
      where: {
        id: calendarEntryId,
      },
      include: {
        calendar_entry_user: {
          select: {
            user: true,
          },
        },
      },
    });
    return new CalendarEntryDto(calendarEntry);
  }

  async create(data: CreateCalendarEntry, communityId: number): Promise<CalendarEntryDto> {
    const calendarEntry = await this.prisma.calendar_entry.create({
      data: {
        name: data.name,
        notes: data.notes ?? '',
        date: new Date(data.date),
        done: data.done ?? false,
        fk_community_id: communityId,
        fk_routine_id: data.fk_routine_id ?? undefined,
      },
    });
    if (data.assignedUsers && data.assignedUsers.length > 0) {
      await this.assignUsersToCalendarEntry(data.assignedUsers, calendarEntry.id);
      return this.getById(calendarEntry.id);
    }
    return new CalendarEntryDto(calendarEntry);
  }

  async assignUsersToCalendarEntry(assignedUsers: number[], calendarEntryId: number) {
    const assignedUsersCalendarEntryIdList = assignedUsers.map((assignedUserId: number) => ({
      fk_user_id: assignedUserId,
      fk_calendar_entry_id: calendarEntryId,
    }));
    await this.prisma.calendar_entry_user.createMany({
      data: assignedUsersCalendarEntryIdList,
    });
  }

  async update(data: UpdateCalendarEntry, communityId: number): Promise<CalendarEntryDto> {
    const calendarEntry = await this.prisma.calendar_entry.update({
      where: { id: data.id },
      data: {
        name: data.name ?? undefined,
        notes: data.notes ?? undefined,
        date: data.date ?? undefined,
        done: data.done ?? undefined,
      },
      include: {
        calendar_entry_user: {
          include: {
            user: true,
          },
        },
      },
    });
    if (data.assignedUsers && data.assignedUsers.length > 0) {
      await this.assignUsersToCalendarEntryWithoutDuplicates(
        data.assignedUsers,
        calendarEntry.calendar_entry_user,
        calendarEntry.id,
      );
    }
    return this.getById(calendarEntry.id);
  }

  async assignUsersToCalendarEntryWithoutDuplicates(
    assignedUsers: number[],
    alreadyAssignedUsers: any[],
    calendarEntryId: number,
  ) {
    const assignedUsersCalendarEntryIdList: { fk_user_id: number; fk_calendar_entry_id: number }[] =
      [];

    assignedUsers.forEach((assignedUserId: number) => {
      if (
        alreadyAssignedUsers.find(
          (alreadyAssignedUser: any) => alreadyAssignedUser.user.id === assignedUserId,
        )
      ) {
        return;
      }
      assignedUsersCalendarEntryIdList.push({
        fk_user_id: assignedUserId,
        fk_calendar_entry_id: calendarEntryId,
      });
    });
    await this.prisma.calendar_entry_user.createMany({
      data: assignedUsersCalendarEntryIdList,
    });
  }

  async interval(startDate: Date, endDate: Date, communityId: number) {
    const calendarEntries = await this.getCalendarEntriesInInterval(
      startDate,
      endDate,
      communityId,
    );
    const routines = await this.getRoutines(communityId);
    for (const routine of routines) {
      const date = routine.startDate;
      while (date <= endDate) {
        if (date >= startDate) {
          const calendarEntry = await this.prisma.calendar_entry.findFirst({
            where: {
              fk_routine_id: routine.id,
              date,
            },
          });
          if (!calendarEntry) {
            console.log('add routine');
            const routineCalendarEntry = new CalendarEntryDto({
              name: routine.name,
              date: new Date(date.getTime()),
              fk_routine_id: routine.id,
              calendar_entry_user: routine.routine_user,
            });
            calendarEntries.push(routineCalendarEntry);
            console.log(date);
          }
        }
        date.setDate(date.getDate() + routine.interval);
      }
    }
    return calendarEntries;
  }

  async getCalendarEntriesInInterval(
    startDate: Date,
    endDate: Date,
    communityId: number,
  ): Promise<CalendarEntryDto[]> {
    const calendarEntries = await this.prisma.calendar_entry.findMany({
      where: {
        fk_community_id: communityId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        calendar_entry_user: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                color: true,
                profile_image: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          date: 'asc',
        },
      ],
    });
    const calendarEntriesDto = calendarEntries.map(
      (calendarEntry) => new CalendarEntryDto(calendarEntry),
    );
    return calendarEntriesDto;
  }

  async getRoutines(communityId: number): Promise<any[]> {
    const routines = await this.prisma.routine.findMany({
      where: {
        fk_community_id: communityId,
        active: true,
      },
      include: {
        routine_user: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                color: true,
                profile_image: true,
              },
            },
          },
        },
      },
    });
    return routines;
  }
}
