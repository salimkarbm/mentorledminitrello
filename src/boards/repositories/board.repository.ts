import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/base.repository';
import { Board } from '../entities/board.entity';

@Injectable()
export class BoardsRepository extends BaseRepository<Board> {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {
    super(boardModel);
  }
}
