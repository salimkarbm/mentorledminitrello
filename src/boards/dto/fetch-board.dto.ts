import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class GetBoardDto {
  @ApiProperty({
    description: 'The MongoDB ID of the Board',
    type: String,
  })
  @IsMongoId({ message: 'invalid data provided' })
  boardId: string;
}
