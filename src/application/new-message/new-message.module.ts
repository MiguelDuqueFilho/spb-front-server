import { Module } from '@nestjs/common';
import { NewMessageService } from './new-message.service';
import { NewMessageController } from './new-message.controller';
import { PrismaNewMessagesRepository } from '../../infra/prisma/repositories/prisma-new-messages-repository';

@Module({
  controllers: [NewMessageController],
  providers: [NewMessageService, PrismaNewMessagesRepository],
})
export class NewMessageModule {}
