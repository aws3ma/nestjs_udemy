import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Injectable } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async deleteTask(id: string, user: User): Promise<number> {
    const res = await this.delete({ id, user });
    return res.affected;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    return await this.save(task);
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    return await this.findOneBy({ id, user });
  }

  async updateTaskByID(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    let task = await this.getTaskByID(id, user);
    task.status = status;
    task = await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    const { search, status } = filterDto;
    query.where({ user });
    if (search) {
      query.andWhere(
        '(LOWER(task.title) like :search OR LOWER(task.description) like :search)',
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
