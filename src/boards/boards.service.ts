import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { LoggedInUser } from 'src/auth/dto/create-auth.dto';
import { FilterQuery, Types } from 'mongoose';
import { BoardsRepository } from './repositories/board.repository';
import { FindType, PaginationResult } from 'src/database/base.repository';
import { Board } from './entities/board.entity';
import { ERROR_MESSAGES } from 'src/utils';

@Injectable()
export class BoardsService {
  constructor(private readonly BoardsRepository: BoardsRepository) {}
  async createBoard(createPostDto: CreateBoardDto, user: LoggedInUser) {
    try {
      const boardExists = await this.BoardsRepository.findOne({
        title: createPostDto.title,
      });
      if (boardExists) {
        throw new BadRequestException(ERROR_MESSAGES.BOARD_ALREADY_EXIST);
      }
      const board = await this.BoardsRepository.create({
        ...createPostDto,
        owner: new Types.ObjectId(user.currentUserId),
      });
      return board;
    } catch (error) {
      if (error.code == 11000)
        throw new HttpException('Board already exist', HttpStatus.BAD_REQUEST);
      throw new BadRequestException('Error occur while creating Board');
    }
  }

  async findBoards(
    data: FilterQuery<Board>,
    options: FindType<Board> = {},
  ): Promise<PaginationResult<Board>> {
    return await this.BoardsRepository.findWithPagination(
      {
        active: true,
        $or: [
          { owner: data.user.currentUserId },
          { members: data.user.currentUserId.toString() },
        ],
      },
      {
        page: data.page,
        limit: data.limit,
        search: data.search,
        populateOptions: [
          {
            path: 'owner',
            model: 'User',
            select: 'fullName',
          },
        ],

        ...options,
      },
    );
  }

  async fetchBoard(param: string) {
    const result = await this.BoardsRepository.findOne(
      {
        _id: param,
        active: true,
      },
      {
        populateOptions: [
          {
            path: 'owner',
            model: 'User',
            select: 'fullName',
          },
        ],
      },
    );
    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_NOT_FOUND);
    }
    return result;
  }

  async remove(param: string, user: LoggedInUser) {
    const post = await this.BoardsRepository.findOne({
      _id: param,
      owner: user.currentUserId,
    });
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.BOARD_NOT_FOUND);
    }
    return await this.BoardsRepository.update(
      {
        _id: param,
        owner: user.currentUserId,
      },
      {
        active: false,
      },
    );
  }
}
