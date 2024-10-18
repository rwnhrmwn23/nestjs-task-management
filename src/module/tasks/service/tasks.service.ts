import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from '../repository/tasks.repository';
import { Task } from '../entity/tasks.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../entity/tasks-status.enum';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { User } from '../../auth/entity/user.entity';
import { BaseResponse } from '../../../common/base-response';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<BaseResponse<Task[]>> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<BaseResponse<Task>> {
    return this.tasksRepository.getTaskById(id, user);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<BaseResponse<Task>> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<BaseResponse<any>> {
    return this.tasksRepository.deleteTaskById(id, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<BaseResponse<Task>> {
    return this.tasksRepository.updateTaskStatus(id, status, user);
  }
}
