import { Logger } from '@nestjs/common';
import { Evento } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export class PrismaEventosRepository {
  logger = new Logger(PrismaEventosRepository.name);
  constructor(private prisma: PrismaService) {}

  async getEvent(CodEvento: string) {
    this.logger.debug(`getEvent(CodEvento: ${CodEvento})`);
    const result = await this.prisma.evento.findUnique({
      where: {
        CodEvento,
      },
      select: {
        CodEvento: true,
        IsConvert: true,
        EventJson: true,
      },
    });
    return result;
  }

  async save(eventos: Evento[]) {
    this.logger.debug(`save(eventos: ${eventos})`);
    const result = await this.prisma.evento.createMany({
      data: eventos as [],
      skipDuplicates: true,
    });
    return result;
  }

  async list(CodEvento: string) {
    this.logger.debug(`list(CodEvento: ${CodEvento})`);
    const result = await this.prisma.evento.findUnique({
      where: {
        CodEvento,
      },
      include: {
        Mensagens: true,
      },
    });
    return result;
  }

  async listByService(service: string) {
    this.logger.debug(`listByService(service: ${service})`);
    const result = await this.prisma.evento.findMany({
      where: {
        GrpServicoId: service,
      },
      select: {
        CodEvento: true,
        NomeEvento: true,
        IsConvert: true,
        Mensagens: true,
      },
      orderBy: {
        CodEvento: 'asc',
      },
    });
    return result;
  }

  async update(CodEvento: string, dataUpdate: any) {
    this.logger.debug(
      `update(CodEvento: ${CodEvento}, dataUpdate: ${dataUpdate})`,
    );
    const result = await this.prisma.evento.update({
      where: {
        CodEvento,
      },
      data: dataUpdate,
    });

    return result;
  }
}
