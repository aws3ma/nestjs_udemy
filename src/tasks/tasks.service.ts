import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
// import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  constructor(private tasksRepo: TasksRepository) {}
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepo.getTasks(filterDto);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksRepo.createTask(createTaskDto);
    // return task;
  }

  async getTaskByID(id: string): Promise<Task> {
    const task = await this.tasksRepo.getTaskByID(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async deleteTaskByID(id: string): Promise<boolean> {
    const res = await this.tasksRepo.deleteTask(id);
    if (res === 0) {
      throw new NotFoundException();
    }
    return true;
  }

  updateTaskByID(id: string, status: TaskStatus): Promise<Task> {
    return this.tasksRepo.updateTaskByID(id, status);
  }
}
