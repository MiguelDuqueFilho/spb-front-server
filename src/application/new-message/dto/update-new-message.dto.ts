import { PartialType } from '@nestjs/swagger';
import { CreateNewMessageDto } from './create-new-message.dto';

export class UpdateNewMessageDto extends PartialType(CreateNewMessageDto) {}
