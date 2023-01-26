import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchemaParamDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  event: string;
}
