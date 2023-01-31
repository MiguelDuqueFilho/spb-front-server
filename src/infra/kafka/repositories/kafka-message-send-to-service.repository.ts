import { Injectable, Logger } from '@nestjs/common';
import { KafkaConsumerService } from '../kafka-consumer.service';
import { Message } from 'kafkajs';
import { randomUUID } from 'node:crypto';
import { NewMessage } from '../../../application/new-message/entities/new-message';
import { KafkaNewMessagesMapper } from '../mappers/kafka-new-messages-mapper';

@Injectable()
export class KafkaMessageSendToServiceRepository {
  private readonly logger = new Logger(
    KafkaMessageSendToServiceRepository.name,
  );
  constructor(private kafka: KafkaConsumerService) {}

  async publishToService(newMessage: NewMessage) {
    this.logger.debug(`publishToService - messageSend`);

    const raw = KafkaNewMessagesMapper.toKafka(newMessage);

    const topic = 'message_service';
    const message: Message[] = [
      {
        key: randomUUID(),
        value: JSON.stringify(raw),
      },
    ];

    this.logger.debug(message);
    await this.kafka.publish(topic, message);
  }
}
