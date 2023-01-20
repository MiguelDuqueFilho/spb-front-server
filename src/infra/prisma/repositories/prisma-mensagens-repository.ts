import { Injectable, Logger } from '@nestjs/common';
import { Mensagem } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMensagensRepository {
  logger = new Logger(PrismaMensagensRepository.name);

  constructor(private prisma: PrismaService) {}

  async save(mensagens: Mensagem[]) {
    this.logger.debug(`save(mensagens: Mensagem[]`);

    const result = await this.prisma.mensagem.createMany({
      data: mensagens as [],
      skipDuplicates: true,
    });
    return result;
  }
}
