import { Module } from '@nestjs/common';
import { TasksController } from '../controller/tasks.controller';
import { TasksService } from '../service/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from '../repository/tasks.repository';
import { Task } from '../entity/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TasksModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
