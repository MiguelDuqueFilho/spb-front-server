import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SchemaService } from './schema.service';
import { CreateSchemaParamDto, UpdateByServiceSchemaParamDto } from './dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { XML } from '../decorator/xml.decorator';

@Controller('schema')
@ApiTags('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Patch('/create/:event')
  @ApiOperation({ summary: 'Create schema XSD in format json to client Web' })
  @ApiResponse({
    status: 200,
    // description: 'Build json OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    // description: 'erro',
  })
  async create(@Param() dto: CreateSchemaParamDto) {
    return await this.schemaService.create(dto.event);
  }

  @Patch('/update/:event')
  async updateSchema(@Param() dto: CreateSchemaParamDto) {
    return await this.schemaService.update(dto.event);
  }

  @Patch('/update/service/:service')
  async UpdateByService(@Param() dto: UpdateByServiceSchemaParamDto) {
    return await this.schemaService.updateSchemaByService(dto.service);
  }

  @Post('/validate/:event')
  @HttpCode(HttpStatus.OK)
  async validate(@Param('event') event: string, @XML() xmlData: string) {
    return await this.schemaService.validate(event, xmlData);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.schemaService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSchemaDto: UpdateSchemaDto) {
  //   return this.schemaService.update(+id, updateSchemaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.schemaService.remove(+id);
  // }
}
