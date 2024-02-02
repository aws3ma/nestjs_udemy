import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(filterDto: GetTasksFilterDto): Task[] {
    let tasks: Task[] = structuredClone(this.tasks);
    if (filterDto.status) {
      tasks = tasks.filter((t: Task) => t.status === filterDto.status);
    }
    if (filterDto.search) {
      tasks = tasks.filter((t: Task) => {
        return (
          t.title.includes(filterDto.search) ||
          t.description.includes(filterDto.search)
        );
        // return true;
        // return false;
      });
    }
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskByID(id: string): Task {
    const task: Task = this.tasks.find((t: Task) => t.id === id);
    return task;
  }

  deleteTaskByID(id: string): void {
    this.tasks = this.tasks.filter((task: Task) => task.id != id);
  }

  updateTaskByID(id: string, status: TaskStatus): Task {
    const index: number = this.tasks.findIndex((t: Task) => t.id === id);
    this.tasks[index].status = status;
    return this.tasks[index];
  }
}
