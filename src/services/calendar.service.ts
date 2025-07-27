import { injectable, inject } from 'tsyringe';
import { PrismaService } from './prisma.service';
import { CreateCalendarEntry } from '../types/createCalendarEntry';
import { CalendarEntryDto } from '../dtos/calendarEntry.dto';
import { UpdateCalendarEntry } from '../types/updateCalendarEntry';
import { routine } from '@prisma/client';
import { CreateRoutine } from '../types/createRoutine';
import { RoutineDto } from '../dtos/routine.dto';
import { UpdateRoutine } from '../types/updateRoutine';

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
      await this.removeUsersFromCalendarEntry(calendarEntry.id);
      await this.assignUsersToCalendarEntry(data.assignedUsers, calendarEntry.id);
    }
    return this.getById(calendarEntry.id);
  }

  async removeUsersFromCalendarEntry(calendarEntryId: number) {
    await this.prisma.calendar_entry_user.deleteMany({
      where: {
        fk_calendar_entry_id: calendarEntryId,
      },
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

  async deleteCalendarEntry(id: number): Promise<void> {
    await this.prisma.calendar_entry_user.deleteMany({
      where: {
        fk_calendar_entry_id: id,
      },
    });
    await this.prisma.calendar_entry.delete({
      where: {
        id: id,
      },
    });
    return;
  }

  async createRoutine(data: CreateRoutine, communityId: number): Promise<RoutineDto> {
    const routine = await this.prisma.routine.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        interval: data.interval,
        fk_community_id: communityId,
      },
    });
    if (data.assignedUsers) {
      await this.assignUsersToRoutine(data.assignedUsers, routine.id);
      const routineWithUsers = await this.getRoutine(routine.id);
      return routineWithUsers;
    }
    return new RoutineDto(routine);
  }

  async assignUsersToRoutine(assignedUsers: number[], routineId: number) {
    const assignedUsersCalendarEntryIdList = assignedUsers.map((assignedUserId: number) => ({
      fk_user_id: assignedUserId,
      fk_routine_id: routineId,
    }));
    await this.prisma.routine_user.createMany({
      data: assignedUsersCalendarEntryIdList,
    });
  }

  async getRoutine(id: number) {
    const routine = await this.prisma.routine.findUnique({
      where: {
        id: id,
      },
      include: {
        routine_user: {
          include: {
            user: true,
          },
        },
      },
    });
    return new RoutineDto(routine);
  }

  async updateRoutine(data: UpdateRoutine, communityId: number): Promise<RoutineDto> {
    await this.prisma.routine.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        startDate: data.startDate,
        interval: data.interval,
        active: data.active,
        fk_community_id: communityId,
      },
    });

    if (data.assignedUsers) {
      await this.deleteUsersFromRoutine(data.id);
      await this.assignUsersToRoutine(data.assignedUsers, data.id);
    }
    const updatedRoutine = await this.getRoutine(data.id);
    return updatedRoutine;
  }

  async deleteUsersFromRoutine(routineId: number) {
    await this.prisma.routine_user.deleteMany({
      where: {
        fk_routine_id: routineId,
      },
    });
  }

  async getAllRoutines(communityId: number): Promise<RoutineDto[]> {
    const routines = await this.prisma.routine.findMany({
      where: {
        fk_community_id: communityId,
      },
      include: {
        routine_user: {
          select: {
            user: true,
          },
        },
      },
    });
    const routinesDto = routines.map((routine) => new RoutineDto(routine));
    return routinesDto;
  }
}
