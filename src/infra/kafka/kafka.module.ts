import { Module } from '@nestjs/common';

import { KafkaController } from './controllers/kafka.controller';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaMessageSendToServiceRepository } from './repositories/kafka-message-send-to-service.repository';

@Module({
  controllers: [KafkaController],
  providers: [KafkaConsumerService, KafkaMessageSendToServiceRepository],
})
export class KafkaModule {}
