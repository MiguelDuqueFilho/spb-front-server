import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateByServiceSchemaParamDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  service: string;
}
