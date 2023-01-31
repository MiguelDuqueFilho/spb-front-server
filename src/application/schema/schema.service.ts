import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchemaComplete } from './schema.complete';
import { SchemaCompactJson } from './schema.compact.json';
import { SchemaTransform } from './schema.transform';
import { PrismaGrupoServicosRepository } from '../../infra/prisma/repositories/prisma-grupo-servicos-repository';
import { PrismaEventosRepository } from '../../infra/prisma/repositories/prisma-eventos-repository';
import libxmljs from 'libxmljs2';
import path from 'node:path';
import fs from 'node:fs';

@Injectable()
export class SchemaService {
  logger = new Logger(SchemaService.name);
  constructor(
    private readonly schemaTransform: SchemaTransform,
    private readonly schemaCompactJson: SchemaCompactJson,
    private readonly schemaComplete: SchemaComplete,
    private readonly prismaGrupoServicosRepository: PrismaGrupoServicosRepository,
    private readonly prismaEventosRepository: PrismaEventosRepository,
  ) {}

  async create(event: string) {
    try {
      /**
       * * transform schema xsd to json
       */
      const bufferJson: any = await this.schemaTransform.execute(event);
      /**
       * * compact json for each element the schema xsd
       */
      const bufferCompact = await this.schemaCompactJson.execute(
        bufferJson,
        event,
      );
      /**
       * * for each element the message complete with complex and simple type
       */
      const result: any = await this.schemaComplete.execute(
        bufferCompact,
        event,
      );

      return {
        xmlns: result.schema.xmlns,
        schema: result.schema,
      };
    } catch (error: any) {
      this.logger.error(
        `Error transformação do xml para Json da mensagem: ${event} ${error.message}.`,
      );
      return {
        CodEvento: event,
        error: `Error transformação do xml para Json da mensagem: ${event}.`,
      };
    }
  }

  async update(event: string) {
    const resultConvert = await this.create(event);
    const { error } = resultConvert as any;
    if (error) {
      await this.prismaEventosRepository.update(event, {
        IsConvert: false,
        EventJson: error,
      });
    } else {
      await this.prismaEventosRepository.update(event, {
        IsConvert: true,
        EventJson: resultConvert,
      });
    }

    const resultServicos = await this.prismaEventosRepository.list(event);
    return resultServicos;
  }

  async updateSchemaByService(service: string) {
    const resultServicos =
      await this.prismaGrupoServicosRepository.listServiceId(service);

    const { Eventos } = resultServicos;

    let total = 0;
    let isConvertedCount = 0;

    for (let i = 0; i < Eventos.length; i++) {
      const resultConvert = await this.create(Eventos[i].CodEvento);

      const evento = await this.prismaEventosRepository.update(
        Eventos[i].CodEvento,
        {
          IsConvert: true,
          EventJson: resultConvert,
        },
      );

      if (evento.IsConvert) {
        isConvertedCount += 1;
      }
      total += 1;
    }

    return { total, isConvertedCount };
  }

  async validate(event: string, xmlData: string) {
    const xmlDoc = libxmljs.parseXml(xmlData, {} as libxmljs.ParserOptions);

    const xmlSchemaDoc = await this.loadXmlSchema(event);

    const validationResult = xmlDoc.validate(xmlSchemaDoc);

    if (validationResult === true) {
      let codMsg = event;
      const regex1 = /(<CodMsg>)([A-Z]{3}[0-9]{4}(E|R1|R2|R3)?)(<\/CodMsg>)/;
      const regex2 = /(<CodMsg>)([^]+)(<\/CodMsg>)/;

      if (regex1.test(xmlData)) {
        const regexArray = regex2.exec(xmlData);
        codMsg = regexArray[2];
      }

      return {
        status: HttpStatus.OK,
        codMsg,
        message: `Event: ${event} Validation Successful`,
      };
    }

    return {
      status: HttpStatus.BAD_REQUEST,
      codMsg: event,
      error: xmlDoc.validationErrors,
    };
  }

  private async loadXmlSchema(filename: string) {
    const serviceDomain = filename.substring(0, 3);
    const schemaPath = path.resolve(
      'xsddoc',
      serviceDomain.toUpperCase(),
      `${filename.toUpperCase()}.XSD`,
    );

    const schemaText = fs.readFileSync(schemaPath, 'latin1');

    return libxmljs.parseXml(schemaText);
  }

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
