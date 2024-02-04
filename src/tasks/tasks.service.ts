import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
// import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(private tasksRepo: TasksRepository) {}
  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepo.getTasks(filterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.tasksRepo.createTask(createTaskDto, user);
    // return task;
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepo.getTaskByID(id, user);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async deleteTaskByID(id: string, user: User): Promise<boolean> {
    const res = await this.tasksRepo.deleteTask(id, user);
    if (res === 0) {
      throw new NotFoundException();
    }
    return true;
  }

  updateTaskByID(id: string, status: TaskStatus, user: User): Promise<Task> {
    return this.tasksRepo.updateTaskByID(id, status, user);
  }
}
