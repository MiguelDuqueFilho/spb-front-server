import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { SchemaCompactJson } from './schema.compact.json';
import { SchemaComplete } from './schema.complete';
import { SchemaTransform } from './schema.transform';

@Module({
  controllers: [SchemaController],
  providers: [
    SchemaService,
    SchemaCompactJson,
    SchemaComplete,
    SchemaTransform,
  ],
})
export class SchemaModule {}
