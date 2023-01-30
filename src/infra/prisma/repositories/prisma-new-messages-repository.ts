import { Injectable, Logger } from '@nestjs/common';
import { NewMessage } from '../../../application/new-message/entities/new-message';

import { PrismaNewMessagesMapper } from '../mappers/prisma-new-messages-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNewMessagesRepository {
  logger = new Logger(PrismaNewMessagesRepository.name);

  constructor(private prisma: PrismaService) {}

  async save(newMessage: NewMessage): Promise<NewMessage> {
    this.logger.debug(`save(newMessage: NewMessageEntity`);
    const raw = PrismaNewMessagesMapper.toPrisma(newMessage);

    const created = await this.prisma.newMessage.create({
      data: raw,
    });

    const result = PrismaNewMessagesMapper.toDomain(created);
    return result;
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
