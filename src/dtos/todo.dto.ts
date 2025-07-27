import { UserDto } from './user.dto';

export class TodoDto {
  id: number;
  name: string;
  description: string;
  done: boolean;
  creator: UserDto;

  constructor(todo: any) {
    this.id = todo.id;
    this.name = todo.name;
    this.description = todo.description;
    this.done = todo.done;
    this.creator = new UserDto(todo.creator);
  }
}
