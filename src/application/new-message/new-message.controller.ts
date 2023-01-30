import {
  Controller,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { NewMessageService } from './new-message.service';
import { XML } from '../decorator';
import { ApiBadRequestResponse } from '@nestjs/swagger';

@Controller('message')
export class NewMessageController {
  constructor(private readonly newMessageService: NewMessageService) {}

  @Post(':event')
  @HttpCode(HttpStatus.OK)
  create(@Param('event') event: string, @XML() xmlMessage: string) {
    return this.newMessageService.createAndSend(event, xmlMessage);
  }

  @Patch('/validate/:event')
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validate error',
  })
  async validate(@Param('event') event: string, @XML() xmlData: string) {
    const result = await this.newMessageService.validate(event, xmlData);
    return result;
  }

  // @Get()
  // findAll() {
  //   return this.newMessageService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.newMessageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateNewMessageDto: UpdateNewMessageDto,
  // ) {
  //   return this.newMessageService.update(+id, updateNewMessageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.newMessageService.remove(+id);
  // }
}
