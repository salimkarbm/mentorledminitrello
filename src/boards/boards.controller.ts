import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ERROR_MESSAGES, HttpResponse, SUCCESS_MESSAGES } from 'src/utils';
import { GetUser } from 'src/common/decorator/user.decorator';
import { LoggedInUser } from 'src/auth/dto/create-auth.dto';
import { Response } from 'express';
import { FilterBoardDto } from './dto/filter-board.dto';
import { GetBoardDto } from './dto/fetch-board.dto';

@Controller('v1/boards')
@ApiTags('v1/boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Board' })
  @ApiBearerAuth() // This indicates that the endpoint requires a Bearer token
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS_MESSAGES.BOARD_CREATED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.UNAUTHORIZED })
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @Res() response: Response,
    @GetUser() user: LoggedInUser,
  ) {
    const result = await this.boardsService.createBoard(createBoardDto, user);
    return HttpResponse({
      message: SUCCESS_MESSAGES.BOARD_CREATED,
      data: result,
      status: HttpStatus.CREATED,
      response,
    });
  }

  /**
   * @description Fetch all boards that the user is a member of or owns.
   * @param filterBoardDto FilterBoardDto
   * @param user LoggedInUser
   * @returns Promise<HttpResponse<PaginationResult<Board>>>
   */
  @Get()
  @ApiOperation({ summary: 'Get Boards' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.BOARD_FETCHED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.BOARD_NOT_FOUND })
  async findAll(
    @Res() response: Response,
    @Query() filterBoardDto: FilterBoardDto,
    @GetUser() user: LoggedInUser,
  ) {
    const result = await this.boardsService.findBoards({
      ...filterBoardDto,
      user,
    });
    return HttpResponse({
      message: SUCCESS_MESSAGES.BOARD_FETCHED,
      data: result,
      status: HttpStatus.OK,
      response,
    });
  }

  @Get('/:boardId')
  @ApiOperation({ summary: 'Get single Board' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.BOARD_FETCHED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.BOARD_NOT_FOUND })
  async findOne(@Param() param: GetBoardDto, @Res() response: Response) {
    const result = await this.boardsService.fetchBoard(param.boardId);
    return HttpResponse({
      message: SUCCESS_MESSAGES.BOARD_FETCHED,
      data: result,
      status: HttpStatus.OK,
      response,
    });
  }

  @Delete('/:boardId')
  @ApiOperation({ summary: 'Delete single Board' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.BOARD_DELETED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.BOARD_NOT_FOUND })
  async remove(
    @Param() param: GetBoardDto,
    @Res() response: Response,
    @GetUser() user: LoggedInUser,
  ) {
    const result = await this.boardsService.remove(param.boardId, user);
    return HttpResponse({
      message: SUCCESS_MESSAGES.BOARD_DELETED,
      data: result,
      status: HttpStatus.OK,
      response,
    });
  }
}
