import { Module } from '@nestjs/common';
import { NewMessageService } from './new-message.service';
import { NewMessageController } from './new-message.controller';
import { PrismaNewMessagesRepository } from '../../infra/prisma/repositories/prisma-new-messages-repository';
import { KafkaMessageSendToServiceRepository } from '../../infra/kafka/repositories/kafka-message-send-to-service.repository';
import { KafkaConsumerService } from '../../infra/kafka/kafka-consumer.service';

@Module({
  controllers: [NewMessageController],
  providers: [
    NewMessageService,
    PrismaNewMessagesRepository,
    KafkaMessageSendToServiceRepository,
    KafkaConsumerService,
  ],
})
export class NewMessageModule {}
