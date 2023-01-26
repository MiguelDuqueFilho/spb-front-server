import { Injectable } from '@nestjs/common';

import { PrismaNewMessagesRepository } from '../../infra/prisma/repositories/prisma-new-messages-repository';
import { NewMessage } from '@prisma/client';

@Injectable()
export class NewMessageService {
  constructor(
    private readonly prismaNewMessagesRepository: PrismaNewMessagesRepository,
  ) {}
  async create(newMessager: NewMessage) {
    return await this.prismaNewMessagesRepository.save(newMessager);
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
