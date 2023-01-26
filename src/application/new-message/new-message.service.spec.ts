import { Test, TestingModule } from '@nestjs/testing';
import { NewMessageService } from './new-message.service';

describe('NewMessageService', () => {
  let service: NewMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewMessageService],
    }).compile();

    service = module.get<NewMessageService>(NewMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
