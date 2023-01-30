import { HttpStatus, Injectable } from '@nestjs/common';

import { PrismaNewMessagesRepository } from '../../infra/prisma/repositories/prisma-new-messages-repository';
import { NewMessage } from './entities/new-message';
import libxmljs from 'libxmljs2';
import path from 'node:path';
import fs from 'node:fs';

@Injectable()
export class NewMessageService {
  constructor(
    private readonly prismaNewMessagesRepository: PrismaNewMessagesRepository, // private readonly schemaService: SchemaService,
  ) {}

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

  async createAndSend(event: string, xmlMessage: string) {
    const resultValidate = await this.validate(event, xmlMessage);

    const newMsg = new NewMessage({
      codMsg: resultValidate.codMsg,
      xmlMessage,
      error: resultValidate.error ? resultValidate.error : [],
      process: 'PENDING',
      status: resultValidate.error ? 'ERROR' : 'VALIDATED',
    });

    const resultNewMessage = await this.prismaNewMessagesRepository.save(
      newMsg,
    );
    return resultNewMessage;
  }

  // findAll() {
  //   return `This action returns all newMessage`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} newMessage`;
  // }

  // update(id: number, updateNewMessageDto: UpdateNewMessageDto) {
  //   return `This action updates a #${id} newMessage`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} newMessage`;
  // }
}
