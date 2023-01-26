import { Injectable, Logger } from '@nestjs/common';
import { NewMessage } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNewMessagesRepository {
  logger = new Logger(PrismaNewMessagesRepository.name);

  constructor(private prisma: PrismaService) {}

  async save(newMessage: NewMessage) {
    this.logger.debug(`save(newMessage: NewMessage`);

    const result = await this.prisma.newMessage.create({
      data: newMessage,
    });
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
