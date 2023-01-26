import { Test, TestingModule } from '@nestjs/testing';
import { NewMessageController } from './new-message.controller';
import { NewMessageService } from './new-message.service';

describe('NewMessageController', () => {
  let controller: NewMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewMessageController],
      providers: [NewMessageService],
    }).compile();

    controller = module.get<NewMessageController>(NewMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
