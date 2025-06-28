import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { LoggedInUser } from 'src/auth/dto/create-auth.dto';
import { FilterQuery, Types } from 'mongoose';
import { ERROR_MESSAGES } from 'src/utils';
import { TasksRepository } from './repositories/task.repository';
import { FindType } from 'src/database/base.repository';
import { Task } from './entities/task.entity';
import { BoardsRepository } from 'src/boards/repositories/board.repository';
import { GetTaskDto } from './dto/fetch-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly TasksRepository: TasksRepository,
    private readonly BoardRepository: BoardsRepository,
  ) {}
  async createTask(createTaskDto: CreateTaskDto, user: LoggedInUser) {
    const boardExists = await this.BoardRepository.findOne({
      _id: createTaskDto.board,
      owner: new Types.ObjectId(user.currentUserId),
    });
    if (!boardExists) {
      throw new BadRequestException(ERROR_MESSAGES.BOARD_NOT_FOUND);
    }
    const task = await this.TasksRepository.create({
      ...createTaskDto,
      board: new Types.ObjectId(createTaskDto.board),
    });
    return task;
  }

  async findTasks(data: FilterQuery<Task>, options: FindType<Task> = {}) {
    console.log(data);
    return await this.TasksRepository.find(
      {
        board: new Types.ObjectId(data.boardId),
      },
      {
        page: data.page,
        limit: data.limit,
        search: data.search,
        populateOptions: [
          {
            path: 'board',
            select: 'title',
          },
        ],
        ...options,
      },
    );
  }

  async fetchTask(param: GetTaskDto) {
    const result = await this.TasksRepository.findOne(
      {
        _id: param.taskId,
        board: new Types.ObjectId(param.boardId),
      },
      {
        populateOptions: [
          {
            path: 'board',
            model: 'Board',
            select: 'tittle',
          },
        ],
      },
    );
    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_NOT_FOUND);
    }
    return result;
  }

  async update(param: GetTaskDto, data: any) {
    const post = await this.TasksRepository.findOne({
      _id: param.taskId,
      board: new Types.ObjectId(param.boardId),
    });
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
    }
    return await this.TasksRepository.update(
      {
        _id: param.taskId,
        board: new Types.ObjectId(param.boardId),
      },
      {
        $set: data,
      },
    );
  }

  async remove(param: GetTaskDto) {
    const post = await this.TasksRepository.findOne({
      _id: param.taskId,
      board: new Types.ObjectId(param.boardId),
    });
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.TASK_NOT_FOUND);
    }
    return await this.TasksRepository.deleteOne({
      _id: param.taskId,
      board: new Types.ObjectId(param.boardId),
    });
  }
}
