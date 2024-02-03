import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async deleteTask(id: string): Promise<number> {
    const res = await this.delete(id);
    return res.affected;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    return await this.save(task);
  }

  async getTaskByID(id: string): Promise<Task> {
    return await this.findOneBy({ id: id });
  }

  async updateTaskByID(id: string, status: TaskStatus): Promise<Task> {
    let task = await this.getTaskByID(id);
    task.status = status;
    task = await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    const { search, status } = filterDto;
    if (search) {
      query.andWhere(
        'LOWER(task.title) like :search OR LOWER(task.description) like :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
