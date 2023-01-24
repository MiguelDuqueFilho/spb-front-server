import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchemaDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  event: string;
}
