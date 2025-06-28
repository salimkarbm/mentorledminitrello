import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
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
import { GetBoardDto } from 'src/boards/dto/fetch-board.dto';
import { GetTaskDto } from './dto/fetch-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('v1/tasks')
@ApiTags('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create Task' })
  @ApiBearerAuth() // This indicates that the endpoint requires a Bearer token
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS_MESSAGES.TASK_CREATED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.UNAUTHORIZED })
  async create(
    @Body() createBoardDto: CreateTaskDto,
    @Res() response: Response,
    @GetUser() user: LoggedInUser,
  ) {
    const result = await this.tasksService.createTask(createBoardDto, user);
    return HttpResponse({
      message: SUCCESS_MESSAGES.TASK_CREATED,
      data: result,
      status: HttpStatus.CREATED,
      response,
    });
  }

  @Get('/:boardId/tasks')
  @ApiOperation({ summary: 'Get all Tasks for a board' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.TASK_FETCHED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.TASK_NOT_FOUND })
  async findAll(@Res() response: Response, @Param() param: GetBoardDto) {
    const result = await this.tasksService.findTasks({
      boardId: param.boardId,
    });
    return HttpResponse({
      message: SUCCESS_MESSAGES.BOARD_FETCHED,
      data: result,
      status: HttpStatus.OK,
      response,
    });
  }

  @Get('/:boardId/:taskId')
  @ApiOperation({ summary: 'Get single Task' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.TASK_FETCHED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.TASK_NOT_FOUND })
  async findOne(@Param() param: GetTaskDto, @Res() response: Response) {
    const result = await this.tasksService.fetchTask(param);
    return HttpResponse({
      message: SUCCESS_MESSAGES.BOARD_FETCHED,
      data: result,
      status: HttpStatus.OK,
      response,
    });
  }

  @Patch('/:boardId/:taskId')
  @ApiOperation({ summary: 'Update single Task' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.TASK_UPDATED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.TASK_NOT_FOUND })
  async update(
    @Param() param: GetTaskDto,
    @Res() response: Response,
    @Body() data: UpdateTaskDto,
  ) {
    const result = await this.tasksService.update(param, data);
    return HttpResponse({
      message: SUCCESS_MESSAGES.TASK_UPDATED,
      data: result,
      status: HttpStatus.OK,
      response,
    });
  }

  @Delete('/:boardId/:taskId')
  @ApiOperation({ summary: 'Delete single Task' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.TASK_DELETED,
  })
  @ApiBadRequestResponse({ description: ERROR_MESSAGES.TASK_NOT_FOUND })
  async remove(@Param() param: GetTaskDto, @Res() response: Response) {
    const result = await this.tasksService.remove(param);
    return HttpResponse({
      message: SUCCESS_MESSAGES.TASK_DELETED,
      data: result,
      status: HttpStatus.OK,
      response,
    });
  }
}
