import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewMessageService } from './new-message.service';
import { CreateNewMessageDto } from './dto/create-new-message.dto';

@Controller('new-message')
export class NewMessageController {
  constructor(private readonly newMessageService: NewMessageService) {}

  @Post()
  create(@Body() createNewMessageDto: CreateNewMessageDto) {
    // return this.newMessageService.create(createNewMessageDto);
    console.log(createNewMessageDto);
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
