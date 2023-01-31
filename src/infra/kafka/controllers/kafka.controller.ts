import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

export interface PayloadSendToServiceRequest {
  id: string;
  codMsg: string;
  msgXml: string;
}

@Controller()
export class KafkaController {
  private readonly logger = new Logger(KafkaController.name);

  @EventPattern('message_service')
  async handleReceiveMessageToService(
    @Payload()
    request: PayloadSendToServiceRequest,
  ) {
    this.logger.log(`message_service - request`);
    this.logger.log(request);
  }

  // @EventPattern('message_pilot')
  // async handleMessageToPilotReceived(@Payload() request: any) {
  //   this.logger.debug(`message_pilot - request`);
  //   this.logger.debug(request);
  // }
}
