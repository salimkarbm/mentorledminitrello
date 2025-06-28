import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Fix login bug' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'The user cannot log in on mobile', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: '60d5f9a9e13d2c3a5c8e5d43' })
  @IsMongoId()
  board: string;
}
