import { DataSource, Repository } from 'typeorm';
import { Task } from '../entity/tasks.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../entity/tasks-status.enum';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { User } from '../../auth/entity/user.entity';
import { executeQueryWithLogging } from '../../../common/query-helpers';
import { BaseResponse } from '../../../common/base-response';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  constructor(protected dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<BaseResponse<Task[]>> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const getData = query.getMany();

    return await executeQueryWithLogging(
      this.logger,
      user.username,
      'getTasks()',
      'Tasks retrieved successfully',
      () => getData,
    );
  }

  async getTaskById(id: string, user: User): Promise<BaseResponse<Task>> {
    const task = this.findOne({
      where: { id, user },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return await executeQueryWithLogging(
      this.logger,
      user.username,
      'getTaskById()',
      'Tasks by id retrieved successfully',
      () => task,
    );
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<BaseResponse<Task>> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    const saveTask = this.save(task);

    return executeQueryWithLogging(
      this.logger,
      user.username,
      'createTask()',
      'Tasks created successfully',
      () => saveTask,
    );
  }

  async deleteTaskById(id: string, user: User): Promise<BaseResponse<any>> {
    const result = await this.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found!`);
    } else {
      return executeQueryWithLogging(
        this.logger,
        user.username,
        'deleteTaskById()',
        'Tasks deleted successfully',
        () => null,
      );
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<BaseResponse<Task>> {
    const result = await this.getTaskById(id, user);

    if (!result || !result.data) {
      throw new NotFoundException(
        `Task with ID ${id} not found for user ${user.username}`,
      );
    } else {
      result.data.status = status;
      const saveTask = this.save(result.data);

      return executeQueryWithLogging(
        this.logger,
        user.username,
        'updateTaskStatus()',
        'Tasks updated successfully',
        () => saveTask,
      );
    }
  }
}
