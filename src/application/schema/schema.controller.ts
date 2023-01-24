import { Controller, Post, Body } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { CreateSchemaDto } from './dto/create-schema.dto';

import { ApiTags } from '@nestjs/swagger';

@Controller('schema')
@ApiTags('catalog')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post()
  create(@Body() createSchemaDto: CreateSchemaDto) {
    return this.schemaService.create(createSchemaDto);
  }

  // @Get()
  // findAll() {
  //   return this.schemaService.findAll();
  // }

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
