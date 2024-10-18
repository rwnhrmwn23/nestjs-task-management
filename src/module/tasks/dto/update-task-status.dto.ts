import { IsEnum } from 'class-validator';
import { TaskStatus } from '../entity/tasks-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
