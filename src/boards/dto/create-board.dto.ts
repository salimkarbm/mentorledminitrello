import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateBoardDto {
  @ApiProperty({
    description: 'this is required, if you want to add title',
    example: 'mentorled',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
