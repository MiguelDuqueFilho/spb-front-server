import { Injectable, Logger } from '@nestjs/common';
import { SchemaComplete } from './schema.complete';
import { SchemaCompactJson } from './schema.compact.json';
import { SchemaTransform } from './schema.transform';
import { CreateSchemaDto } from './dto/create-schema.dto';

@Injectable()
export class SchemaService {
  logger = new Logger(SchemaService.name);
  constructor(
    private schemaTransform: SchemaTransform,
    private schemaCompactJson: SchemaCompactJson,
    private schemaComplete: SchemaComplete,
  ) {}

  async create(createSchemaDto: CreateSchemaDto) {
    try {
      /**
       * * transform schema xsd to json
       */
      const bufferJson: any = await this.schemaTransform.execute(
        createSchemaDto.event,
      );
      /**
       * * compact json for each element the schema xsd
       */
      const bufferCompact = await this.schemaCompactJson.execute(
        bufferJson,
        createSchemaDto.event,
      );
      /**
       * * for each element the message complete with complex and simple type
       */
      const result: any = await this.schemaComplete.execute(
        bufferCompact,
        createSchemaDto.event,
      );

      return {
        xmlns: result.schema.xmlns,
        schema: result.schema,
      };
    } catch (error: any) {
      this.logger.error(
        `Error transformação do xml para Json da mensagem: ${createSchemaDto.event} ${error.message}.`,
      );
      return {
        CodEvento: event,
        error: `Error transformação do xml para Json da mensagem: ${createSchemaDto.event}.`,
      };
    }
  }

  // findAll() {
  //   return `This action returns all schema`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} schema`;
  // }

  // update(id: number, updateSchemaDto: UpdateSchemaDto) {
  //   return `This action updates a #${id} schema`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} schema`;
  // }
}
