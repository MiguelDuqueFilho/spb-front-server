import { NewMessage as RawNewMessage } from '@prisma/client';
import { NewMessage } from '../../../application/new-message/entities/new-message';

export class KafkaNewMessagesMapper {
  static toKafka(newMessage: NewMessage) {
    return {
      id: newMessage.id,
      codMsg: newMessage.codMsg,
      xmlMessage: newMessage.xmlMessage,
      process: newMessage.process,
      status: newMessage.status,
      error: newMessage.error,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    };
  }

  static toDomain(rawNewMessage: RawNewMessage): NewMessage {
    return new NewMessage({
      id: rawNewMessage.id,
      codMsg: rawNewMessage.codMsg,
      xmlMessage: rawNewMessage.xmlMessage,
      process: rawNewMessage.process,
      status: rawNewMessage.status,
      error: rawNewMessage.error as object,
      createdAt: rawNewMessage.createdAt,
      updatedAt: rawNewMessage.updatedAt,
    });
  }
}
