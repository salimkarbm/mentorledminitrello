import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class GetTaskDto {
  @ApiProperty({
    description: 'The MongoDB ID of the Board',
    type: String,
  })
  @IsMongoId({ message: 'invalid data provided' })
  boardId: string;

  @ApiProperty({
    description: 'The MongoDB ID of the Task',
    type: String,
  })
  @IsMongoId({ message: 'invalid data provided' })
  taskId: string;
}
