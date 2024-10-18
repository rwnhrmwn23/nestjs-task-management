import { Module } from '@nestjs/common';
import { TasksController } from '../controller/tasks.controller';
import { TasksService } from '../service/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from '../repository/tasks.repository';
import { Task } from '../entity/tasks.entity';
import { AuthModule } from '../../auth/module/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
